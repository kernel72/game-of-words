import axios from 'axios'
import { GameSessionData } from './types'

axios.defaults.baseURL = '/api/v1'

const SESSION_ENDPOINT = '/session'

export type GameDataDto = {
  session_id: string
  main_word: string
  found_words: string[]
  known_words_amount: number
}

type TransformResponseFunc = (data: GameDataDto) => GameSessionData

const transformGameData: TransformResponseFunc = (data: GameDataDto) => {
  const { session_id, main_word, found_words, known_words_amount } = data

  return {
    id: session_id,
    mainWord: main_word,
    foundWords: found_words,
    knownWordsAmount: known_words_amount
  }
}

type CreateNewGameOptions = {
  minimumWordLength: number
}

const DEFAULT_GAME_OPTIONS: CreateNewGameOptions = {
  minimumWordLength: 5,
}

export const createNewGame = async (gameOptions: CreateNewGameOptions = DEFAULT_GAME_OPTIONS) => {
  const { data } = await axios.post<GameDataDto>(SESSION_ENDPOINT, gameOptions)
  return transformGameData(data)
}

type ApplyWordRequestParams = {
  sessionId: string
  word: string
}
export const applyWord = async ({
  sessionId,
  word,
}: ApplyWordRequestParams) => {
  const { data } = await axios.post<GameDataDto>(
    `${SESSION_ENDPOINT}/${sessionId}/apply`,
    {
      word,
    },
  )

  return transformGameData(data)
}

type GetGameDataBySessionIdParams = {
  sessionId: string
}

export const getGameBySessionId = async ({
  sessionId,
}: GetGameDataBySessionIdParams) => {
  const { data } = await axios.get<GameDataDto>(
    `${SESSION_ENDPOINT}/${sessionId}`,
  )

  return transformGameData(data)
}
