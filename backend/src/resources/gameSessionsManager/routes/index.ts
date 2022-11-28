import { Router, Request, Response, NextFunction } from 'express'

type Middleware = (req: Request, res: Response, next: NextFunction) => void

import {
  IGameSession,
  GameSessions,
  WordIsAlreadyPresentError,
  WordIsNotIncludedError,
} from 'src/resources/gameSessionsManager'
import { Word } from '../model'

import { HttpError } from '../../../http/types'

export const router = Router()

router.post(
  '/session',
  catchUnhandled((_, res, __) => {
    const game = GameSessions.createGameSession()

    res.json(game.getGameData())
  }),
)

router.get(
  '/session/:sessionId',
  getGameSessionMiddlw('sessionId'),
  catchUnhandled(async (_, res, __) => {
    const game: IGameSession = res.locals.game

    res.json(game.getGameData())
  }),
)

router.post(
  '/session/:sessionId/applyWord',
  getGameSessionMiddlw('sessionId'),
  catchUnhandled(async (req, res, next) => {
    const game: IGameSession = res.locals.game

    const body: {
      word: Word
    } = req.body

    if (!req.body || !req.body.word) {
      const e = new HttpError("'word' is not specified")
      e.status = 400
      return next(e)
    }

    const { word } = body

    try {
      game.applyWord(word)
    } catch (e) {
      const error = new HttpError(e.message)
      if (
        e instanceof WordIsAlreadyPresentError ||
        e instanceof WordIsNotIncludedError
      ) {
        error.status = 400
      }
      return next(error)
    }

    res.json(game.getGameData())
  }),
)

function getGameSessionMiddlw(reqParam: string): Middleware {
  return (req, res, next) => {
    const sessionId = req.params[reqParam]
    const game = GameSessions.getGameSessionById(sessionId)
    if (!game) {
      const e = new HttpError('Game not found')
      e.status = 404
      return next(e)
    }
    res.locals.game = game
    next()
  }
}

function catchUnhandled(func: Middleware): Middleware {
  return async (req, res, next) => {
    try {
      await func(req, res, next)
    } catch (e) {
      if (typeof e === 'undefined') {
        return next(new HttpError('Unhandled rejection'))
      }
      return next(e)
    }
  }
}
