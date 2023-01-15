import { FC } from 'react'
import { Box } from '@mui/material'
import { useGameSession } from '../../hooks'

import SubmitWordForm from './SubmitWordForm'
import GameLoadFailed from './GameLoadFail'

type Props = {
  sessionId: string
}

export const Game: FC<Props> = ({ sessionId }) => {
  const {
    data: gameData,
    isFetched,
    isError,
    error,
  } = useGameSession(sessionId)

  if (!isFetched || !gameData) {
    return <Box>Загружаем...</Box>
  }

  if (isError) {
    // @ts-expect-error FIX MEE
    return <GameLoadFailed errorMessage={error} />
  }

  const { mainWord, history, knownWordsAmount } = gameData

  return (
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
        <Box fontSize="6rem">{mainWord}</Box>
      </Box>
      <Box height="70vh" display="flex" justifyContent="center">
        <Box width="40%" marginX="30%">
          <Box textAlign="center">
            <Box>Введите слово, которое можно составить из слова выше</Box>
            <Box marginTop="4rem">
              <SubmitWordForm sessionId={sessionId} />
            </Box>
          </Box>
          <Box marginTop="5rem">
            <Box>
              Найденные слова ({history.length} / {knownWordsAmount})
            </Box>
            <Box display="flex" flexWrap="wrap">
              {history.map((word) => (
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
