import React from 'react'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { GameSessionContextProvider } from 'src/resources/GameSession/context'
import Game from 'src/resources/GameSession/components/Game'
import NewGamePage from './resources/GameSession/components/NewGamePage'

const App: React.FC = () => (
  <GameSessionContextProvider>
    <Router>
      <Switch>
        <Route path='/' exact component={NewGamePage} />
        <Route path='/g/:sessionId' component={Game} />
      </Switch>
    </Router>
  </GameSessionContextProvider>
)

export default App
