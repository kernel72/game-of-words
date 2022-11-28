import axios from 'axios'
import { GameSessionData } from './types'

axios.defaults.baseURL = '/api/v1'

const SESSION_ENDPOINT = '/session'

export type GameDataDto = {
  sessionId: string
  word: string
  history: string[]
  amountOfIncludedWords: number
}

type TransformResponseFunc = (data: GameDataDto) => GameSessionData

const transformGameData: TransformResponseFunc = (data: GameDataDto) => {
  const { sessionId, word, history, amountOfIncludedWords } = data

  return {
    id: sessionId,
    mainWord: word,
    history,
    totalPossibleWords: amountOfIncludedWords,
  }
}

export const createNewGame = async () => {
  const { data } = await axios.post<GameDataDto>(
    SESSION_ENDPOINT,
    undefined,
  )
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
    `${SESSION_ENDPOINT}/${sessionId}/applyWord`,
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
