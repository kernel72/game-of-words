import { useContext, useCallback } from 'react'
import GameSessionContext from './context'
import { useHistory } from 'react-router-dom'

export const useNewGameCreator = () => {
  const { startNewGame } = useContext(GameSessionContext)
  const history = useHistory()

  const startGame = useCallback(async () => {
      const {sessionId} = await startNewGame()
      history.push(`/g/${sessionId}`)
    }
  , [history, startNewGame])

  return startGame
}
