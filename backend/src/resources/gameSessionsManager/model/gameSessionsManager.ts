import { GameSession } from './gameSession'
import { GameSessionId, IGameSession, IGameSessionsManager } from './types'

class GameSessionsManager implements IGameSessionsManager {
  private gameSessions: Record<GameSessionId, IGameSession> = {}

  public createGameSession() {
    const game = new GameSession()
    this.gameSessions[game.getId()] = game
    return game
  }

  public getGameSessionById(sessionId: GameSessionId) {
    return this.gameSessions[sessionId]
  }

  public closeGameSession(sessionId: GameSessionId) {
    delete this.gameSessions[sessionId]
  }
}

export const GameSessions = new GameSessionsManager()
