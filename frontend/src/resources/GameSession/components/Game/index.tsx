import React, { useContext, useCallback, useEffect } from 'react'
import { Box } from '@material-ui/core'

import GameSessionContext from 'src/resources/GameSession/context'
import SubmitWordForm from './SubmitWordForm'
import GameLoadFailed from './GameLoadFail'
import { useParams } from 'react-router-dom'

const Game: React.FC = () => {
  const {
    currentGameSession: { game, isLoaded, loadError },
    applyWord,
    loadGame,
  } = useContext(GameSessionContext)

  const { sessionId } = useParams()

  const submitWord = useCallback(
    async (word) => {
      await applyWord(word)
    },
    [applyWord],
  )

  useEffect(() => {
    if (!isLoaded) {
      loadGame(sessionId)
    }
  }, [isLoaded, loadGame, sessionId])

  return !isLoaded ? (
    <Box>Loading game...</Box>
  ) : loadError ? (
    <GameLoadFailed errorMessage={loadError} />
  ) : (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box>
        <Box>SessionId: {sessionId}</Box>
        <Box>Main Word: {game?.mainWord}</Box>
        <Box>History: {game?.history.join(', ')}</Box>
      </Box>
      <Box>
        <SubmitWordForm onSubmit={submitWord} />
      </Box>
    </Box>
  )
}

export default Game
