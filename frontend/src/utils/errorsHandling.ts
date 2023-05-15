import { AxiosError } from 'axios'

export type RequestErrorDetails<TKey = string, TParams = undefined> = {
  error_key: TKey
  error_params: TParams extends object ? TParams : undefined
}

export type RequestErrorData<TErrorDetails = RequestErrorDetails> = {
  detail: TErrorDetails
}

function isAxiosError(e: unknown): e is AxiosError {
  const err = e as AxiosError
  return err.isAxiosError
}

export function assertIsAxiosError(e: unknown): asserts e is AxiosError {
  if (!isAxiosError(e)) throw new Error('Not an axios Error')
}

export const getResponseErrorDetails = <TErrorDetails = RequestErrorDetails>(
  e: AxiosError,
): TErrorDetails | undefined => {
  const errData = e.response?.data as
    | RequestErrorData<TErrorDetails>
    | undefined
  return errData?.detail
}

export const getErrorMessage = (err: unknown): string => {
  if (!(err instanceof Error)) {
    console.error('Unknown error', err)
    return `Unknown error: ${err}`
  }

  if (isAxiosError(err)) {
    const errData = getResponseErrorDetails(err)
    return errData?.error_key || err.message
  }

  return err.message
}
