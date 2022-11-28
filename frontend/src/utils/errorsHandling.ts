import { AxiosError } from 'axios'

type RequestErrorData = {
  code: number
  message: string
}

export const getErrorMessage = (e: unknown): string => {
  if (e instanceof AxiosError<RequestErrorData>) {
    return e.response?.data.message || e.message
  }

  return String(e)
}