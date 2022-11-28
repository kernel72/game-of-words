import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getGameBySessionId, applyWord, createNewGame } from './api'

const QUERY_KEY = 'sessions'

export const useGameSession = (sessionId: string) => {
  return useQuery(
    [QUERY_KEY, sessionId],
    () => getGameBySessionId({ sessionId }),
    { enabled: Boolean(sessionId) },
  )
}

export const useWordApplier = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [QUERY_KEY, sessionId],
    mutationFn: (word: string) => applyWord({ sessionId, word }),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, sessionId], data)
    },
  })
}

export const useNewGameCreator = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createNewGame(),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data)
    },
  })
}
