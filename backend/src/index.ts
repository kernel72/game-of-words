import 'module-alias/register'
import { Library } from 'src/core/library'
import * as path from 'path'
import { AddressInfo } from 'net'

import app, { logger } from './app'

Library.loadLibraryFromFile(
  path.resolve(__dirname, '../dicts/words-rus-index.json'),
).then(() => {
  const listener = app.listen(8080, () => {
    const addresInfo: AddressInfo = listener.address() as AddressInfo
    logger.info(
      `Ready and listening at ${addresInfo.address}:${addresInfo.port}`,
    )
  })
})

module.exports = app
