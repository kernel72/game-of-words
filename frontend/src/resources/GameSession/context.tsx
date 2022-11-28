import { createContext, FC, ReactNode, useState } from 'react'

type GameSessionContextType = {
  sessionId?: string
  setSessionId: (sessionId?: string) => void
}

export const GameSessionContext = createContext<GameSessionContextType>({
  sessionId: undefined,
  setSessionId: () => {},
})

type Props = {
  children: ReactNode
}

export const GameSessionContextProvider: FC<Props> = ({ children }) => {
  const [currentSessionId, setSessionId] = useState<string | undefined>()

  return (
    <GameSessionContext.Provider
      value={{
        sessionId: currentSessionId,
        setSessionId: (newSessionId?: string) => {
          setSessionId(newSessionId)
        },
      }}
    >
      {children}
    </GameSessionContext.Provider>
  )
}
