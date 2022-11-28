import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  GameSessionContextProvider,
  GamePage,
  NewGamePage,
} from 'src/resources/GameSession'

const App: React.FC = () => {
  const queryClient = new QueryClient()

  const router = createBrowserRouter([
    {
      path: '/',
      element: <NewGamePage />,
    },
    {
      path: '/g/:sessionId',
      element: <GamePage />,
    },
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <GameSessionContextProvider>
        <RouterProvider router={router} />
      </GameSessionContextProvider>
    </QueryClientProvider>
  )
}

export default App
