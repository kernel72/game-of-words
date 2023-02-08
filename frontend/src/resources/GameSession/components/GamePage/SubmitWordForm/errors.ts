import { RequestErrorDetails } from 'src/utils/errorsHandling'

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
  [WORD_IS_NOT_INCLUDED_ERROR]: 'Такое слово нельзя составить из основного',
  [WORD_IS_ALREADY_PRESENT_ERROR]: 'Такое слово уже найдено',
  [WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR]:
    'Слово должно быть не менее {{charsAmount}} букв',
} as const

export type WordIsLessThanRequiredLengthError = RequestErrorDetails<
  typeof WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR,
  {
    required_length: number
  }
>
