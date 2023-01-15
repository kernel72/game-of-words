import { AxiosError } from 'axios'

export type RequestGeneralErrorData = {
  code: number
  name: string
  message: string
}

export const getResponseErrorData = <TErrorData = RequestGeneralErrorData>(
  e: AxiosError<TErrorData>,
): TErrorData | undefined => e.response?.data

export const getErrorMessage = (e: unknown): string => {
  if (e instanceof AxiosError<RequestGeneralErrorData>) {
    return e.response?.data.message || e.message
  }

  return String(e)
}
