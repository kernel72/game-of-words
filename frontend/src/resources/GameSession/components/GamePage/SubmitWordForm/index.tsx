import { FC, useCallback, useEffect } from 'react'
import { useForm, UseControllerProps, useController } from 'react-hook-form'
import { TextField, Button, Box } from '@mui/material'

import { useWordApplier } from 'src/resources/GameSession/hooks'
import {
  assertIsRequestErrorData,
  getErrorMessage,
  getResponseErrorDetails,
} from 'src/utils/errorsHandling'

import {
  ApplyWordErrorMessages,
  WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR,
  wordLengthIsLessThanRequiredErrorParamsSchema,
  isErrorApplyWordError,
} from './errors'

type Props = {
  sessionId: string
}

type FormData = {
  wordToSubmit: string
}

const getGameErrorMessage = (err: unknown): string => {
  const errorMessage = getErrorMessage(err)

  if (!isErrorApplyWordError(errorMessage)) {
    return errorMessage
  }

  switch (errorMessage) {
    case WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR:
      assertIsRequestErrorData(err)
      const details = getResponseErrorDetails(err)

      const errParams = wordLengthIsLessThanRequiredErrorParamsSchema.parse(
        details.error_params,
      )

      return ApplyWordErrorMessages[errorMessage].replace(
        '{{charsAmount}}',
        errParams.required_length.toString(),
      )

    default:
      return ApplyWordErrorMessages[errorMessage]
  }
}

const WordToSubmitInputField: FC<UseControllerProps<FormData>> = (props) => {
  const {
    field,
    fieldState: { isTouched, error },
  } = useController(props)

  return (
    <TextField
      {...field}
      fullWidth={true}
      autoFocus={true}
      error={Boolean(isTouched && error)}
      helperText={error?.message}
    />
  )
}

export const SubmitWordForm: FC<Props> = ({ sessionId }) => {
  const { mutateAsync: applyWord } = useWordApplier(sessionId)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      wordToSubmit: '',
    },
  })

  const onSubmit = useCallback(
    async ({ wordToSubmit }: FormData) => {
      if (!wordToSubmit.length) {
        return
      }

      try {
        await applyWord(wordToSubmit)
      } catch (e) {
        setError('wordToSubmit', { message: getGameErrorMessage(e) })
      }
    },
    [applyWord, setError],
  )

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box width="100%" display="flex">
        <Box flex="1">
          <WordToSubmitInputField name="wordToSubmit" control={control} />
        </Box>
        <Box marginLeft="1rem">
          <Button
            disabled={isSubmitting}
            variant="outlined"
            color="primary"
            type="submit"
          >
            Проверить
          </Button>
        </Box>
      </Box>
    </form>
  )
}
