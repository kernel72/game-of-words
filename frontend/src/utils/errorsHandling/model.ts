import { z } from 'zod'

export const requestErrorDataSchema = z.object({
  response: z.object({
    data: z.object({
      detail: z.object({
        error_key: z.string(),
        error_params: z.unknown().optional(),
      }),
    }),
  }),
})

export type RequestErrorData = z.infer<typeof requestErrorDataSchema>

export const isRequestErrorData = (data: unknown): data is RequestErrorData => {
  return requestErrorDataSchema.safeParse(data).success
}

export function assertIsRequestErrorData(
  data: unknown,
): asserts data is RequestErrorData {
  if (!isRequestErrorData(data)) throw new Error('data is not RequestErrorData')
}
