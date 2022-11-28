import { FC, useCallback } from 'react'
import {
  Form,
  FormRenderProps,
  Field,
  FieldRenderProps,
} from 'react-final-form'

import { TextField, Button, Box } from '@mui/material'
import { FormApi } from 'final-form'

import { getErrorMessage } from 'src/utils/errorsHandling'

import { useWordApplier } from '../../../hooks'
import { GAME_ERRORS_MESSAGES } from './errors'

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
        const message = getErrorMessage(e)

        return { wordToSubmit: GAME_ERRORS_MESSAGES[message] ?? message }
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
