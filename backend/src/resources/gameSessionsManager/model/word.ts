import { Word, MainWordData } from './types'

export class MainWord {
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

  public checkWordIncludes(word: Word): boolean {
    return this.mainWordData.includedWords.includes(word.trim().toLowerCase())
  }
}
