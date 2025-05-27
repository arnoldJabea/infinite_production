import { test } from '@japa/runner'
import supertest from 'supertest'
import app from '@adonisjs/core/services/app'

test.group('Health route', () => {
  test('GET / should reply OK', async ({ assert }) => {
    const server = supertest((await app.httpServer()).instance!)
    const res = await server.get('/').expect(200)

    assert.equal(res.body.message, 'API Infinite Production Backend OK')
  })
})