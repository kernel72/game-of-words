import { z } from 'zod'

const gameSessionDataSchema = z.object({
  id: z.string(),
  mainWord: z.string(),
  foundWords: z.array(z.string()),
  knownWordsAmount: z.number(),
})

export type GameSessionData = z.infer<typeof gameSessionDataSchema>
