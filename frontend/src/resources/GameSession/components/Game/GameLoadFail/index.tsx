import React from 'react'
import { Box } from '@material-ui/core'

import NewGameButton from 'src/resources/GameSession/components/NewGameButton'

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
