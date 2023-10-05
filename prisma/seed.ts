import { db, redis } from "../src/server/db";
import { type Quiz } from "../src/server/db/schema"
import * as tmdb from "../src/utils/tmdb"
import {
  REDIS_QUIZZES_KEY,
  MAX_QUIZZES
} from "../src/constants"


async function main() {
  const quizzesLength = Number(await redis.llen(REDIS_QUIZZES_KEY))
  const numQuizzes = Number.isFinite(quizzesLength) ? MAX_QUIZZES - quizzesLength : MAX_QUIZZES
  if (numQuizzes <= 0) return console.log('no quizzes needed')
  const limit = 50
  const popularActors = []
  let page = 0
  let totalPages = 0
  while (page === 0 || page < totalPages) {
    page++
    console.log(page, new Date().toISOString())
    const popularPersonResult = await tmdb.person.popular(page)
    for (const actor of popularPersonResult.results) {
      if (actor.known_for_department === 'Acting' && actor.known_for.some(m => m.original_language.startsWith('en'))) {
        popularActors.push({
          id: actor.id,
          name: actor.name,
          profile_path: actor.profile_path,
          known_for: actor.known_for.reduce((acc, cur) => {
            if (cur.original_language === 'en') acc.push(cur.id)
            return acc
          }, [] as number[])
        })
      }
    }
    if (!totalPages) totalPages = popularPersonResult.total_pages
    if (page >= limit) break
  }
  // console.log(actors)
  // console.log(actors.length)
  const quizzes = []
  const randomSelection = new Set()
  while (quizzes.length < numQuizzes) {
    const randomIx = Math.floor(Math.random() * popularActors.length)
    if (randomSelection.has(randomIx)) continue
    randomSelection.add(randomIx)
    const randomActor = popularActors[randomIx]
    console.log(randomActor)
    if (!randomActor) throw new Error('missing actor')
    const actorCredits = await tmdb.person.movieCredits(randomActor.id)
    const actorMovies = [...actorCredits.cast]
    let selectedMovie
    while (!selectedMovie) {
      const randomMovie = actorMovies.splice(Math.floor(Math.random() * (actorMovies.length - 1)), 1)[0]
      if (!randomMovie) break
      if (randomMovie.popularity >= 10 && randomMovie.order <= 3) {
        selectedMovie = randomMovie
      }
    }
    if (!selectedMovie) continue
    const movieDetailsAndCreditsResponse = await tmdb.movie.detailsAndCredits(selectedMovie.id)
    const quizActors = []

    const quiz: Quiz = {
      title: movieDetailsAndCreditsResponse.title,
      id: movieDetailsAndCreditsResponse.id,
      release_date: movieDetailsAndCreditsResponse.release_date,
      overview: movieDetailsAndCreditsResponse.overview,
      tagline: movieDetailsAndCreditsResponse.tagline,
      actors: []
    }
    quizActors.push({
      correct: true,
      name: randomActor.name,
      id: randomActor.id,
      profile_path: randomActor.profile_path
    })
    while (quizActors.length < 4) {
      const otherRandomIx = Math.floor(Math.random() * popularActors.length)
      const otherRandomActor = popularActors[otherRandomIx]
      if (
          otherRandomActor &&
          quizActors.every(a => a.id !== otherRandomActor.id) &&
          movieDetailsAndCreditsResponse.credits.cast.every(c => c.id !== otherRandomActor.id)
        ) {
        quizActors.push({
          correct: false,
          name: otherRandomActor.name,
          id: otherRandomActor.id,
          profile_path: otherRandomActor.profile_path
        })
      }
    }
    // randomize order
    while (quizActors.length) {
      const quizActor = quizActors.splice(Math.floor(Math.random() * quizActors.length), 1)[0]
      if (quizActor) quiz.actors.push(quizActor)
    }
    quizzes.push(quiz)
  }
  await redis.multi(quizzes.map(q => {
    return ['rpush', REDIS_QUIZZES_KEY, JSON.stringify(q)]
  })).exec()
  console.log('fin')
  // redis.multi(quizzes.map(q => JSON.stringify(q)))



  // const peopleResult = await fetch
  // const id = "cl9ebqhxk00003b600tymydho";
  // await db.example.upsert({
  //   where: {
  //     id,
  //   },
  //   create: {
  //     id,
  //   },
  //   update: {},
  // });
}

main()
  .then(async () => {
    await db.$disconnect();
    redis.disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });