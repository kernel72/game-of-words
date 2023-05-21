import { z } from 'zod'

export const gameDataDtoSchema = z.object({
  session_id: z.string(),
  main_word: z.string(),
  found_words: z.array(z.string()),
  known_words_amount: z.number(),
})

export type GameDataDto = z.infer<typeof gameDataDtoSchema>

export const isGameDataDto = (data: unknown): data is GameDataDto => {
  const check = gameDataDtoSchema.safeParse(data)
  return check.success
}

export function assertIsGameDataDto(data: unknown): asserts data is GameDataDto {
  if (!isGameDataDto(data)) throw new Error('value is not GameDataDto')
}
