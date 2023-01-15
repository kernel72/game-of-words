import { Word, MainWordData } from './types'

export class MainWord {
  private mainWordData: MainWordData

  constructor(mainWordData: MainWordData) {
    this.mainWordData = mainWordData
  }

  public getMainWord(): Word {
    return this.mainWordData.word
  }

  public getIncludedWords(): Word[] {
    return this.mainWordData.included_words
  }

  public checkWordIncludes(word: Word): boolean {
    return this.mainWordData.included_words.includes(word.trim().toLowerCase())
  }
}
