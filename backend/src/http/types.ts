export class HttpError extends Error {
  public status: number = 500
}

export type HttpErrorResponseBody = {
  code: number
  message: string
  errors?: string[]
  stack?: string
}
