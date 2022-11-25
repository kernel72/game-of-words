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
    <Box
      height="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        height="30vh"
        display="flex"
        justifyContent="center"
        textAlign="center"
        flexDirection="column"
      >
        <Box fontSize="6rem">{game?.mainWord}</Box>
      </Box>
      <Box height="70vh" display="flex" justifyContent="center">
        <Box width="40%" marginX="30%">
          <Box textAlign="center">
            <Box>Введите слово, которое можно составить из слова выше</Box>
            <Box marginTop="4rem">
              <SubmitWordForm onSubmit={submitWord} />
            </Box>
          </Box>
          <Box marginTop="5rem">
            <Box>Найденные слова ({game?.history.length} / {game?.amountOfIncludedWords})</Box>
            <Box display="flex" flexWrap="wrap">
              {game?.history.map((word) => (
                <Box key={word} marginTop="0.5rem" marginRight="0.5rem">
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Game
