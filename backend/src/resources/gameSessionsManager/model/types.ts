export type GameSessionId = string
export type Word = string

export type MainWordData = {
  mainWord: Word
  includedWords: Word[]
}

export type GameData = {
  sessionId: GameSessionId
  word: Word
  history: Word[]
  amountOfIncludedWords: number
  allIncludedWords: Word[]
}

export interface IGameSessionsManager {
  createGameSession(): IGameSession
  getGameSessionById(sessionId: GameSessionId): IGameSession
  closeGameSession(sessionId: GameSessionId): void
}

export interface IGameSession {
  applyWord(word: Word): void
  getMainWord(): Word
  getWordsHistory(): Word[]
  getId(): GameSessionId
  getGameData(): GameData
}
