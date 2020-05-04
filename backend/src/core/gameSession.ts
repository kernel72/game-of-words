import * as shortId from 'shortid'
import { MainWord, IMainWord } from './word'
import * as log4js from 'log4js'
import { Library } from './library'
import { GameSessionId, Word } from './types'

const logger: log4js.Logger = log4js.getLogger('app')

export class InvalidWordError extends Error {}
export class WordAlreadyPresentError extends Error {}

export type GameData = {
  sessionId: GameSessionId
  word: Word
  history: Word[]
}

export interface IGameSession {
  applyWord(word: Word): void
  getMainWord(): Word
  getWordsHistory(): Word[]
  getId(): GameSessionId
  getGameData(): GameData
}

class GameSession implements IGameSession {
  private id: GameSessionId = shortId.generate()
  private wordsHistory: string[] = []
  private mainWordInstance: IMainWord = new MainWord(Library.getRandomWord())

  constructor() {
    logger.info(`New game session started ${this.id}`)
  }

  public applyWord(word: Word): void {
    word = word && word.trim().toLowerCase()
    const { isValid, validationError } = this.mainWordInstance.isValidWord(word)

    if (!isValid) {
      throw new InvalidWordError(validationError)
    }

    if (this.wordsHistory.includes(word)) {
      throw new WordAlreadyPresentError('Word is already present')
    }

    this.wordsHistory.push(word)
  }

  public getId(): GameSessionId {
    return this.id
  }

  public getMainWord(): Word {
    return this.mainWordInstance.getMainWord()
  }

  public getWordsHistory(): Word[] {
    return this.wordsHistory
  }

  public getGameData(): GameData {
    return {
      sessionId: this.getId(),
      word: this.getMainWord(),
      history: this.getWordsHistory(),
    }
  }
}

class GameSessionsStorage {
  private gameSessions: {
    [index: string]: IGameSession
  } = {}

  public getNewGame() {
    const game = new GameSession()
    this.gameSessions[game.getId()] = game
    return game
  }

  public getGameSession(sessionId: GameSessionId) {
    return this.gameSessions[sessionId]
  }

  public closeGameSession(sessionId: GameSessionId) {
    delete this.gameSessions[sessionId]
  }
}

export const GameSessions = new GameSessionsStorage()
