import { Library } from 'src/core/library'

import * as log4js from 'log4js'
import express, { Response, Request, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import { router } from './routes'
import { HttpError, HttpErrorResponseBody } from './core/types'
import { AddressInfo } from 'net'

const app = express()

const httpLogger = log4js.getLogger('http')
const logger = log4js.getLogger('app')

httpLogger.level = 'debug'
logger.level = 'debug'

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

Library.loadLibraryFromFile(
  path.resolve(__dirname, './dicts/words-rus.txt'),
).then(() => {
  const listener = app.listen(8080, () => {
    const addresInfo: AddressInfo = listener.address() as AddressInfo
    logger.info(
      `Ready and listening at ${addresInfo.address}:${addresInfo.port}`,
    )
  })
})

module.exports = app
