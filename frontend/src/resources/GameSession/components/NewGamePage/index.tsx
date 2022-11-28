import { FC, useContext, useEffect } from 'react'
import { GameSessionContext } from '../../context'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { NewGameButton } from '../NewGameButton'

export const NewGamePage: FC = () => {
  const navigate = useNavigate()
  const { sessionId } = useContext(GameSessionContext)

  useEffect(() => {
    if (!sessionId) {
      return
    }
    navigate(`/g/${sessionId}`)
  }, [sessionId, navigate])

  return (
    <Box
      width="100%"
      height="100vh"
      textAlign="center"
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Box>
        <NewGameButton />
      </Box>
    </Box>
  )
}
