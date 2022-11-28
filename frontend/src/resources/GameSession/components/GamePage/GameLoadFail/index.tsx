import React from 'react'
import { Box } from '@mui/material'

import { NewGameButton } from '../../NewGameButton'

type Props = {
  errorMessage: string
}

const GameLoadFailed: React.FC<Props> = ({ errorMessage = '' }) => {
  return (
    <Box>
      <Box> Failed to load the game - {errorMessage} </Box>
      <Box>
        <NewGameButton />
      </Box>
    </Box>
  )
}

export default GameLoadFailed
