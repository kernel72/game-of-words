import { FC, useCallback, useContext } from 'react'
import { useNewGameCreator } from '../../hooks'
import { GameSessionContext } from '../../context'
import { Button } from '@mui/material'

export const NewGameButton: FC = () => {
  const { mutateAsync: createNewGame } = useNewGameCreator()
  const { sessionId, setSessionId } = useContext(GameSessionContext)

  const onClick = useCallback(async () => {
    if (sessionId) {
      return
    }

    const data = await createNewGame()
    setSessionId(data.id)
  }, [createNewGame, sessionId, setSessionId])

  return (
    <Button variant="outlined" color="primary" onClick={onClick}>
      Новая Игра
    </Button>
  )
}
