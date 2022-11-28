import * as shortId from 'shortid'
import * as log4js from 'log4js'

import { Library } from '../../library'

import { MainWord } from './word'
import { GameSessionId, Word, GameData, IGameSession } from './types'

const logger: log4js.Logger = log4js.getLogger('app')

export class WordIsNotIncludedError extends Error {
  public message: string = 'WordIsNotIncludedError'
}
export class WordIsAlreadyPresentError extends Error {
  public message: string = 'WordIsAlreadyPresentError'
}

export class GameSession implements IGameSession {
  private id: GameSessionId = shortId.generate()
  private wordsHistory: Word[] = []
  private mainWordInstance = new MainWord(Library.getRandomMainWord())

  constructor() {
    logger.info(`New game session started ${this.id}`)
  }

  public applyWord(word: Word): void {
    word = word && word.trim().toLowerCase()
    const isIncluded = this.mainWordInstance.checkWordIncludes(word)

    if (!isIncluded) {
      throw new WordIsNotIncludedError()
    }

    if (this.wordsHistory.includes(word)) {
      throw new WordIsAlreadyPresentError()
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
      amountOfIncludedWords: this.mainWordInstance.getIncludedWords().length,
      allIncludedWords: this.mainWordInstance.getIncludedWords(),
      history: this.getWordsHistory(),
    }
  }
}
