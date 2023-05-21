import { RequestErrorData, isRequestErrorData } from './model'

export const getResponseErrorDetails = (e: RequestErrorData) => {
  return e.response.data.detail
}

export const getErrorMessage = (err: unknown): string => {
  if (!(err instanceof Error)) {
    console.error('Unknown error', err)
    return `Unknown error: ${err}`
  }

  if (isRequestErrorData(err)) {
    return err.response.data.detail.error_key
  }

  return err.message
}
