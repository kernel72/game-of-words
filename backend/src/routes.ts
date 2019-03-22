import { Router, Request, Response, NextFunction } from 'express'

type Middleware = (req: Request, res: Response, next: NextFunction) => void

import {
  IGameSession,
  GameSessions,
  InvalidWordError,
  WordAlreadyPresentError,
} from 'src/core/gameSession'
import { Word, HttpError } from './core/types'

export const router = Router()

router.post(
  '/session',
  catchUnhandled((_, res, __) => {
    const game = GameSessions.getNewGame()

    res.json({
      sessionId: game.getId(),
      word: game.getMainWord(),
    })
  }),
)

router.get(
  '/session/:sessionId',
  getGameSessionMiddlw('sessionId'),
  catchUnhandled(async (_, res, __) => {
    const game: IGameSession = res.locals.game

    res.json({
      sessionId: game.getId(),
      word: game.getMainWord(),
      history: game.getWordsHistory(),
    })
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
        e instanceof InvalidWordError ||
        e instanceof WordAlreadyPresentError
      ) {
        error.status = 400
      }
      return next(e)
    }

    res.json({
      history: game.getWordsHistory(),
    })
  }),
)

function getGameSessionMiddlw(reqParam: string): Middleware {
  return (req, res, next) => {
    const game = GameSessions.getGameSession(req.params[reqParam])
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
