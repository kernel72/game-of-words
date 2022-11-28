import * as log4js from 'log4js'
import express, { Response, Request, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import { router } from './resources/gameSessionsManager/routes'
import { HttpError, HttpErrorResponseBody } from './http/types'

const app = express()

const httpLogger = log4js.getLogger('http')
export const logger = log4js.getLogger('app')

httpLogger.level = process.env.HTTP_LOG_LEVEL || 'debug'
logger.level = process.env.APP_LOG_LEVEL || 'debug'

app.use(log4js.connectLogger(httpLogger, {}))
app.use(bodyParser.json())
app.use(router)

app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
  const response: HttpErrorResponseBody = {
    code: err.status || 500,
    message: err.message,
  }

  if (response.code === 500) {
    response.stack = err.stack
    logger.error(err)
  }

  res.status(response.code).json(response)
})

export default app
