import { z } from 'zod'

export const WORD_IS_NOT_INCLUDED_ERROR = 'WordIsNotIncludedError'
export const WORD_IS_ALREADY_PRESENT_ERROR = 'WordIsAlreadyFoundError'
export const WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR =
  'WordLengthIsLessThanRequiredError'

export type ApplyWordError = [
  typeof WORD_IS_NOT_INCLUDED_ERROR,
  typeof WORD_IS_ALREADY_PRESENT_ERROR,
  typeof WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR,
][number]

export const ApplyWordErrorMessages: Record<ApplyWordError, string> = {
  [WORD_IS_NOT_INCLUDED_ERROR]:
    'Это слово или нельзя составить или оно не существительное в единственном числе',
  [WORD_IS_ALREADY_PRESENT_ERROR]: 'Это слово уже найдено',
  [WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR]:
    'Слово должно быть не менее {{charsAmount}} букв',
} as const

export const wordLengthIsLessThanRequiredErrorParamsSchema = z.object({
  required_length: z.number(),
})

export const isErrorApplyWordError = (err: string): err is ApplyWordError =>
  Object.keys(ApplyWordErrorMessages).includes(err)
