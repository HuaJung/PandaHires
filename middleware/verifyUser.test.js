import {jest} from '@jest/globals'
import {verifyJWT}  from "./verifyUser.js";
import jwt from "jsonwebtoken"
import express from 'express'
import request from 'supertest'


const app = express()


app.use((req, res, next) => {
  req.cookies = { token: req.headers['x-token'] }
  next()
})

app.use(verifyJWT)


const generateToken = (id, timezoneOffset) => {
  return jwt.sign({id, timezoneOffset}, process.env.ACCESS_TOKEN_SECRET)
}


describe('auth middleware', () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = 'test_secret'
  })

  test('should return 401 not login yet', async () => {
    const response = await request(app)
      .get('/')
      .expect(401)
    expect(response.body).toEqual({ error: true, message: 'not login yet' })
  })

  test('should return 403 forbidden', async () => {
    const response = await request(app)
      .get('/')
      .set('x-token', 'invalid_token')
      .expect(403)
    expect(response.body).toEqual({ error: true, message: 'forbidden' })
  })

  test('should yield user id and timezoneOffest after decoding the token', async () => {
    const validToken = generateToken(1, -300)
    const req = {
      cookies: { token: validToken }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    const next = jest.fn()

    await verifyJWT(req, res, next)
    expect(req).toHaveProperty('id')
    expect(req).toHaveProperty('timezoneOffset')
    expect(next).toHaveBeenCalled()

  }) 

})


