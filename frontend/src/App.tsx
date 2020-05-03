import React, { useContext, useState } from 'react'
import { Button, Box, Input } from '@material-ui/core'

import GameSessionContext, {
  GameSessionContextProvider,
} from 'src/GameSession/context'

const App: React.FC = () => (
  <GameSessionContextProvider>
    <Game />
  </GameSessionContextProvider>
)

const Game: React.FC = () => {
  const { startNewGame, currentGameSession, applyWord } = useContext(
    GameSessionContext,
  )

  const [wordToApply, setWordToApply] = useState<string>("")
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => startNewGame()}
        >
          New Game
        </Button>
      </Box>
      <Box>
        <Box>SessionId: {currentGameSession?.sessionId}</Box>
        <Box>Main Word: {currentGameSession?.mainWord}</Box>
        <Box>History: {currentGameSession?.history.join(', ')}</Box>
      </Box>
      <Box display="flex" >
        <Input onChange={e => setWordToApply(e.target.value.trim())}/>
        <Button variant="outlined" color="primary" onClick={() => {
          applyWord(wordToApply)
        }}>Apply</Button>
      </Box>
    </Box>
  )
}

export default App
