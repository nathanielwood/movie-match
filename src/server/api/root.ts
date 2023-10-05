import { exampleRouter } from "~/server/api/routers/example";
import { quizRouter } from "~/server/api/routers/quiz"
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
