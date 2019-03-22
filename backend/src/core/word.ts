import { Word } from './types'

type LettersMap = {
  [index: string]: number
}

export type WordValidationResult = {
  isValid: boolean
  validationError?: string
}

export interface IMainWord {
  isValidWord(word: Word): WordValidationResult
  getMainWord(): Word
}

export class MainWord implements IMainWord {
  public static parseWord(word: string): LettersMap {
    const lettersMap: LettersMap = {}
    for (const letter of word) {
      if (lettersMap[letter] === undefined) {
        lettersMap[letter] = 0
      }
      lettersMap[letter]++
    }
    return lettersMap
  }

  private mainWord: string
  private lettersMap: LettersMap

  constructor(word: Word) {
    this.mainWord = word.trim().toLowerCase()
    this.lettersMap = MainWord.parseWord(this.mainWord)
  }

  public getMainWord(): Word {
    return this.mainWord
  }

  public isValidWord(word: Word): WordValidationResult {
    if (!word || word.length < 3) {
      return {
        isValid: false,
        validationError: 'Word should be more than 2 letters.',
      }
    }

    if (word === this.mainWord) {
      return {
        isValid: false,
        validationError: 'Word is the same as main word',
      }
    }

    const letterMap = { ...this.lettersMap }

    for (const char of word) {
      if (char.toUpperCase() === char.toLowerCase()) {
        return {
          isValid: false,
          validationError: 'Word contains special symbols.',
        }
      }

      const charsAmount = letterMap[char]

      if (charsAmount === undefined) {
        return {
          isValid: false,
          validationError: `No letter '${char}' in this word`,
        }
      }

      if (charsAmount === 0) {
        return {
          isValid: false,
          validationError: `Only ${
            this.lettersMap[char]
          } entries of '${char}' is acceptable.`,
        }
      }

      letterMap[char]--
    }

    return { isValid: true }
  }
}
