import React, { useCallback, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = '/api/v1'

const SESSION_ENDPOINT = '/session'

export type GameSession = {
  sessionId: string
  mainWord: string
  history: string[]
}

type NewGameSessionResponse = {
  sessionId: string
  word: string
}

export type GameSessionContext = {
  startNewGame: () => Promise<void>
  currentGameSession: GameSession | null
  applyWord: (word: string) => Promise<void>
}

const GameSessionContext = React.createContext<GameSessionContext>(
  {} as GameSessionContext,
)

export const GameSessionContextProvider: React.FC = ({ children }) => {
  const [
    currentGameSession,
    setCurrentGameSession,
  ] = useState<GameSession | null>(null)

  const startNewGame = useCallback(async () => {
    const {
      data: { sessionId, word: mainWord },
    } = await axios.post<NewGameSessionResponse>(SESSION_ENDPOINT)
    console.log('New game started', sessionId)
    setCurrentGameSession({ sessionId, mainWord, history: [] })
  }, [setCurrentGameSession])

  const applyWord = useCallback(
    async (word: string) => {
      if (!currentGameSession) {
        console.error('Game is not started')
        return
      }

      const { sessionId } = currentGameSession
      const {
        data: { history },
      } = await axios.post(`${SESSION_ENDPOINT}/${sessionId}/applyWord`, {
        word,
      })

      setCurrentGameSession({ ...currentGameSession, history })
    },
    [currentGameSession],
  )

  return (
    <GameSessionContext.Provider
      value={{
        currentGameSession,
        startNewGame,
        applyWord,
      }}
    >
      {children}
    </GameSessionContext.Provider>
  )
}

export default GameSessionContext
