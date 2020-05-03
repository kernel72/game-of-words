import supertest from 'supertest'
import app from 'src/app'
import { Library } from 'src/core/library'

const request = supertest(app)

const MAIN_WORD = 'молокозавод'

describe('Endpoint /session', () => {
  beforeEach(async () => {
    await Library.loadLibraryFromArray([MAIN_WORD])
  })

  describe('POST /session', () => {
    it('should return sessionId and word', async () => {
      const { body, status } = await request.post('/session')

      expect(status).toBe(200)
      expect(body).toEqual({
        word: MAIN_WORD,
        sessionId: expect.stringContaining(body.sessionId),
      })
    })
  })

  describe('GET /session/:sessionId', () => {
    it('should return sessionId data', async () => {
      const {
        body: { sessionId },
      } = await request.post('/session')

      const { body, status } = await request.get(`/session/${sessionId}`)
      expect(status).toBe(200)
      expect(body).toEqual({
        sessionId: expect.stringContaining(body.sessionId),
        word: MAIN_WORD,
        history: [],
      })
    })

    it('should return 404 if sessionId not found', async () => {
      const { body, status } = await request.get(`/session/invalidSession`)
      expect(status).toBe(404)
      expect(body).toEqual({
        message: 'Game not found',
        code: 404,
      })
    })
  })

  describe('POST /session/:sessionId/applyWord', () => {
    let gameSessionId: string
    beforeEach(async () => {
      const {
        body: { sessionId },
      } = await request.post('/session')
      gameSessionId = sessionId
    })

    it('should return list of applied words, if word has passed', async () => {
      const sendWord = 'молоко'

      const { body, status } = await request
        .post(`/session/${gameSessionId}/applyWord`)
        .send({
          word: sendWord,
        })

      expect(status).toBe(200)
      expect(body).toEqual({
        history: [sendWord],
      })
    })

    it('should return 404 if sessionId not found', async () => {
      const { body, status } = await request
        .post(`/session/invalidSessionId/applyWord`)
        .send({
          word: 'word',
        })

      expect(status).toBe(404)
      expect(body).toEqual({
        message: 'Game not found',
        code: 404,
      })
    })

    it('should fail with 400 if word has not passed', async () => {
      const sendWord = 'test'

      const { body, status } = await request
        .post(`/session/${gameSessionId}/applyWord`)
        .send({
          word: sendWord,
        })

      expect(status).toBe(400)
      expect(body).toEqual({
        code: 400,
        message: expect.stringContaining(body.message),
      })
    })

    it('should fail with 400 if word is alredy present', async () => {
      await request.post(`/session/${gameSessionId}/applyWord`).send({
        word: 'молоко',
      })

      const { body, status } = await request
        .post(`/session/${gameSessionId}/applyWord`)
        .send({
          word: 'молоко',
        })

      expect(status).toBe(400)
      expect(body).toEqual({
        code: 400,
        message: 'Word is already present',
      })
    })
  })
})
