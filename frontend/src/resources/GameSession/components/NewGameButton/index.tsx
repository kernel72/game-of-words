import React from 'react'
import { useNewGameCreator } from 'src/resources/GameSession/hooks'
import { Button } from '@material-ui/core'

const NewGameButton: React.FC = () => {
  const startNewGame = useNewGameCreator()
  return (
    <Button variant="outlined" color="primary" onClick={startNewGame}>
      Новая Игра
    </Button>
  )
}
export default NewGameButton
