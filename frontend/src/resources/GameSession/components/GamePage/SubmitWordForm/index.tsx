import { FC, useCallback, useEffect } from 'react'
import { useForm, UseControllerProps, useController } from 'react-hook-form'
import { TextField, Button, Box } from '@mui/material'

import { useWordApplier } from 'src/resources/GameSession/hooks'
import {
  getErrorMessage,
  getResponseErrorDetails,
  assertIsAxiosError,
} from 'src/utils/errorsHandling'

import {
  ApplyWordError,
  ApplyWordErrorMessages,
  WordIsLessThanRequiredLengthError,
  WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR,
} from './errors'

type Props = {
  sessionId: string
}

type FormData = {
  wordToSubmit: string
}

const getGameErrorMessage = (err: unknown): string => {
  if (!(err instanceof Error)) {
    console.error('Unknown error', err)
    return `Unknown error: ${err}`
  }

  const errorMessage = getErrorMessage(err)

  if (!Object.keys(ApplyWordErrorMessages).includes(errorMessage)) {
    return errorMessage
  }

  switch (errorMessage) {
    case WORD_LENGTH_IS_LESS_THAN_REQUIRED_ERROR:
      assertIsAxiosError(err)
      const errorData =
        getResponseErrorDetails<WordIsLessThanRequiredLengthError>(err)

      return ApplyWordErrorMessages[errorData!.error_key].replace(
        '{{charsAmount}}',
        errorData!.error_params.required_length.toString(),
      )

    default:
      return ApplyWordErrorMessages[errorMessage as ApplyWordError]
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
