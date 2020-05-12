import React, { useCallback } from 'react'
import {
  Form,
  FormRenderProps,
  Field,
  FieldRenderProps,
} from 'react-final-form'

import { TextField, Button, Box } from '@material-ui/core'

type Props = {
  onSubmit: (word: string) => Promise<void>
}

const WordToSubmitInputFieldRender: React.FC<FieldRenderProps<
  string,
  HTMLInputElement
>> = ({ input, meta }) => {
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

const SubmitWordForm: React.FC<Props> = ({ onSubmit }) => {
  const onFormSubmit = useCallback(
    async ({ wordToSubmit }, form) => {
      try {
        await onSubmit(wordToSubmit)
      } catch (e) {
        return { wordToSubmit: e.message }
      }
      setTimeout(form.reset)
    },
    [onSubmit],
  )

  return (
    <Form
      onSubmit={onFormSubmit}
      render={({ handleSubmit, submitting }: FormRenderProps) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box width="100%" display="flex">
              <Box flex="1">
              <Field
                name="wordToSubmit"
                render={WordToSubmitInputFieldRender}
              />
              </Box>
              <Box marginLeft="1rem">
              <Button
                disabled={submitting}
                variant="outlined"
                color="primary"
                type="submit"
              >
                Добавить
              </Button>
              </Box>
            </Box>
          </form>
        )
      }}
    />
  )
}

export default SubmitWordForm
