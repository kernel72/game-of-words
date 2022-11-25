import { Word, MainWordData } from './types'

export type WordValidationResult = {
  isPassed: boolean
  passingError?: string
}

export interface IMainWord {
  isWordPassed(word: Word): WordValidationResult
  getMainWord(): Word
  getIncludedWords(): Word[]
}

export class MainWord implements IMainWord {
  private mainWordData: MainWordData

  constructor(mainWordData: MainWordData) {
    this.mainWordData = mainWordData
  }

  public getMainWord(): Word {
    return this.mainWordData.mainWord
  }

  public getIncludedWords(): Word[] {
    return this.mainWordData.includedWords
  }

  public isWordPassed(word: Word): WordValidationResult {
    const isIncluded = this.mainWordData.includedWords.includes(
      word.trim().toLowerCase(),
    )

    return isIncluded
      ? { isPassed: true }
      : {
          isPassed: false,
          passingError: 'WordIsNotIncluded',
        }
  }
}
