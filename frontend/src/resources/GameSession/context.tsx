import React, { useCallback, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = '/api/v1'

const SESSION_ENDPOINT = '/session'

export type Game = {
  mainWord: string
  history: string[]
}

export type GameSession = {
  sessionId?: string
  isLoaded: boolean
  loadError?: string
  game?: Game
}

type GameDataResponse = {
  sessionId: string
  word: string
  history: string[]
}

export type GameSessionContext = {
  startNewGame: () => Promise<GameSession>
  currentGameSession: GameSession
  applyWord: (word: string) => Promise<GameSession>
  loadGame: (sessionId: string) => Promise<GameSession>
}

const GameSessionContext = React.createContext<GameSessionContext>(
  {} as GameSessionContext,
)

export const GameSessionContextProvider: React.FC = ({ children }) => {
  const [currentGameSession, setCurrentGameSession] = useState<GameSession>({
    isLoaded: false,
  })

  const startNewGame = useCallback(async () => {
    const {
      data: { sessionId, word: mainWord, history },
    } = await axios.post<GameDataResponse>(SESSION_ENDPOINT)
    console.log('New game started', sessionId)
    const gameSessionData = {
      sessionId,
      game: { mainWord, history },
      isLoaded: true,
    }

    setCurrentGameSession(gameSessionData)
    return gameSessionData
  }, [setCurrentGameSession])

  const applyWord = useCallback(
    async (word: string) => {
      if (!currentGameSession.isLoaded) {
        throw new Error('Game is not started')
      }

      const { sessionId } = currentGameSession
      
      try {
        const {
          data: { history, word: mainWord },
        } = await axios.post<GameDataResponse>(
          `${SESSION_ENDPOINT}/${sessionId}/applyWord`,
          {
            word,
          },
        )

        const gameSessionData = {
          ...currentGameSession,
          game: { mainWord, history },
        }

        setCurrentGameSession(gameSessionData)
        return gameSessionData
      } catch (e) {
        const response = e?.response
        if (response.status === 400) {
          throw new Error(response.data.message)
        }
        throw e
      }
    },
    [currentGameSession],
  )

  const loadGame = useCallback(async (loadSessionId: string) => {
    let gameSessionData
    try {
      const {
        data: { sessionId, word: mainWord, history },
      } = await axios.get<GameDataResponse>(
        `${SESSION_ENDPOINT}/${loadSessionId}`,
      )

      gameSessionData = {
        sessionId,
        game: { mainWord, history },
        isLoaded: true,
      }


    } catch (e) {
      const errorMesage =
        e.response?.status === 404 ? 'Game not found' : e.message

      gameSessionData = {
        sessionId: loadSessionId,
        isLoaded: true,
        loadError: errorMesage,
      }

      
    }
    setCurrentGameSession(gameSessionData)
    return gameSessionData
  }, [])

  return (
    <GameSessionContext.Provider
      value={{
        loadGame,
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
