import { env } from "~/env.mjs"

type Method = 'GET' | 'POST' | 'DELETE'

type MovieCreditsActor = {
  id: number
  name: string
  order: number
  popularity: number
}
type MovieCreditsResponse = {
  id: number
  cast: MovieCreditsActor[]
}
type MovieDetailsAndCreditsResponse = {
  id: number
  title: string
  release_date: string
  tagline: string
  overview: string
  credits: {
    cast: MovieCreditsActor[]
  }
}
type KnownForMovie = {
  id: number
  title: string
  original_language: string
}
type PersonPopularResults = {
  id: number
  name: string
  profile_path: string
  known_for_department: string
  known_for: KnownForMovie[]
}
type PersonPopularResponse = {
  page: number
  results: PersonPopularResults[]
  total_pages: number
  total_results: number
}

type ErrorResponse = {
  status_code: number
  status_message: string
}

type Result = MovieDetailsAndCreditsResponse | MovieCreditsResponse |PersonPopularResponse | ErrorResponse

// TODO: move to Redis
let requestTimeStamps: Date[] = []

const apiRequest = async (path: string, searchParams?: Record<string, string>, method: Method = 'GET') => {
  // remove requests older than 1 second old
  requestTimeStamps = requestTimeStamps.filter(d => Date.now() - d.getTime() <= 1000)
  while (requestTimeStamps.length >= 30) {
    // make no more than 30 requests per second
    await new Promise((resolve, _reject) => setTimeout(resolve, 100))
    requestTimeStamps = requestTimeStamps.filter(d => Date.now() - d.getTime() <= 1000)
  }
  const url = new URL(path, env.TMDB_API_URL)
  const params = new URLSearchParams(searchParams)
  params.append('language', 'en-US')
  url.search = `?${params.toString()}`
  const options = {
    method,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${env.TMDB_API_TOKEN}`
    }
  }
  requestTimeStamps.push(new Date())
  const res = await fetch(url, options)
  const result = await res.json() as Result
  if ("status_code" in result) {
    console.log('error on', path, searchParams, method, result)
    throw new Error(result.status_message)
  }
  return result
}

const movie = {
  detailsAndCredits: (movieId: number) => apiRequest(`/3/movie/${movieId}`, { append_to_response: 'credits' }) as Promise<MovieDetailsAndCreditsResponse>,
  credits: (movieId: number) => apiRequest(`/3/movie/${movieId}/credits`) as Promise<MovieCreditsResponse>
}


const person = {
  popular: (page: number) => apiRequest('/3/person/popular', { page: String(page) }) as Promise<PersonPopularResponse>,
  movieCredits: (personId: number) => apiRequest(`/3/person/${personId}/movie_credits`) as Promise<MovieCreditsResponse>
}

export {
  movie,
  person
}