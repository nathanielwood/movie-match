// import { z } from "zod";
import { redis } from "~/server/db"
import { type Quiz } from "~/server/db/schema"
import { REDIS_QUIZZES_KEY } from "~/constants"

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
  getQuiz: publicProcedure.query(async () => {
    const quiz = await redis.lpop(REDIS_QUIZZES_KEY)
    if (!quiz) throw new Error('no quiz available')
    redis.llen(REDIS_QUIZZES_KEY)
      .then(v => {
        if (v < 50) console.log('refresh')
      })
      .catch(console.error)
    return JSON.parse(quiz) as Quiz
  }),
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
