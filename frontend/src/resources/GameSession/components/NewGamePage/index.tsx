import React, { useContext, useEffect } from 'react'
import GameSessionContext from 'src/resources/GameSession/context'
import { Box } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import NewGameButton from '../NewGameButton'

const NewGamePage: React.FC = () => {
  const { currentGameSession } = useContext(GameSessionContext)

  const history = useHistory()

  useEffect(() => {
    if (!currentGameSession.isLoaded) {
      return
    }
    history.push(`/g/${currentGameSession.sessionId}`)
  }, [currentGameSession, history])
  
  return (
    <Box>
      <NewGameButton />
    </Box>
  )
}

export default NewGamePage
