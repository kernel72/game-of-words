import { AxiosError } from 'axios'

export type RequestErrorDetails<TKey = string, TParams = undefined> = {
  error_key: TKey
  error_params: TParams extends object ? TParams : undefined
}

export type RequestErrorData<TErrorDetails = RequestErrorDetails> = {
  detail: TErrorDetails
}

export const getResponseErrorDetails = <TErrorDetails = RequestErrorDetails>(
  e: AxiosError,
): TErrorDetails | undefined => {
  const errData = e.response?.data as RequestErrorData<TErrorDetails> | undefined
  return errData?.detail
}

export const getErrorMessage = (e: Error): string => {
  const errData = getResponseErrorDetails(e as AxiosError)
  return errData?.error_key || e.message
}
