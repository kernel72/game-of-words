import { FC, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { GameSessionContext } from '../../context'

import { Game } from './Game'

export const GamePage: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { sessionId: currentSessionId, setSessionId } =
    useContext(GameSessionContext)

  useEffect(() => {
    if(sessionId && sessionId !== currentSessionId){
      setSessionId(sessionId)
    }
  }, [currentSessionId, sessionId, setSessionId])

  if (!sessionId) {
    return null
  }

  return <Game sessionId={sessionId} />
}
