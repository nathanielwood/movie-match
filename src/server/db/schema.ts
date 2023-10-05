import { z } from "zod"

export const Quiz = z.object({
  title: z.string(),
  id: z.number(),
  release_date: z.string(),
  overview: z.string(),
  tagline: z.string(),
  actors: z.object({
    id: z.number(),
    correct: z.boolean(),
    name: z.string(),
    profile_path: z.string()
  }).array()
})

export type Quiz = z.infer<typeof Quiz>