import { FC, useCallback } from 'react'
import {
  Form,
  FormRenderProps,
  Field,
  FieldRenderProps,
} from 'react-final-form'

import { TextField, Button, Box } from '@mui/material'
import { FormApi } from 'final-form'

import {
  getErrorMessage,
  getResponseErrorData,
  RequestGeneralErrorData,
} from 'src/utils/errorsHandling'

import { useWordApplier } from '../../../hooks'
import {
  ApplyWordError,
  ApplyWordErrorMessages,
  WordIsLessThanRequiredLengthError,
  WORD_IS_LESS_THAN_REQUIRED_LENGTH_ERROR,
} from './errors'
import { AxiosError } from 'axios'

type Props = {
  sessionId: string
}

type FormValues = {
  wordToSubmit: string
}

const WordToSubmitInputField: FC<FieldRenderProps<string, HTMLElement>> = ({
  input,
  meta,
}) => {
  return (
    <TextField
      fullWidth={true}
      autoFocus={true}
      name={input.name}
      onChange={input.onChange}
      error={Boolean(meta.touched && (meta.error || meta.submitError))}
      helperText={meta.touched && (meta.error || meta.submitError)}
      value={input.value}
      required
    />
  )
}

const getGameErrorMessage = (e: unknown): string => {
  if (!(e instanceof AxiosError<RequestGeneralErrorData>)) {
    return getErrorMessage(e)
  }

  const errorData = getResponseErrorData<RequestGeneralErrorData>(e)
  if (!errorData) {
    return getErrorMessage(e)
  }

  if (!Object.keys(ApplyWordErrorMessages).includes(errorData.name)) {
    return errorData.message
  }

  const errName: ApplyWordError = errorData.name as ApplyWordError

  switch (errName) {
    case WORD_IS_LESS_THAN_REQUIRED_LENGTH_ERROR:
      const data = errorData as WordIsLessThanRequiredLengthError
      return ApplyWordErrorMessages[
        WORD_IS_LESS_THAN_REQUIRED_LENGTH_ERROR
      ].replace('{{charsAmount}}', data.minimumValue)
    default:
      return ApplyWordErrorMessages[errName]
  }
}

const SubmitWordForm: FC<Props> = ({ sessionId }) => {
  const { mutateAsync: applyWord } = useWordApplier(sessionId)

  const onFormSubmit = useCallback(
    async ({ wordToSubmit }: FormValues, form: FormApi<FormValues>) => {
      const formState = form.getState()
      if (formState.invalid) {
        return
      }

      try {
        await applyWord(wordToSubmit)
      } catch (e) {
        return { wordToSubmit: getGameErrorMessage(e) }
      }
      setTimeout(form.reset)
    },
    [applyWord],
  )

  return (
    <Form<FormValues> onSubmit={onFormSubmit}>
      {({ handleSubmit, submitting }: FormRenderProps<FormValues>) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box width="100%" display="flex">
              <Box flex="1">
                <Field<string>
                  name="wordToSubmit"
                  component={WordToSubmitInputField}
                />
              </Box>
              <Box marginLeft="1rem">
                <Button
                  disabled={submitting}
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
      }}
    </Form>
  )
}

export default SubmitWordForm
