import express from 'express'
import {jest} from '@jest/globals'
import { getUser, updateUser, deleteAccount } from './userController.js'
import {userUpdate} from '../models/userModel.js';
import { User } from '../models/db.js'



const app = express()


jest.mock('../models/userModel.js')
jest.mock('../models/db.js')

describe('TEST userController', () => {
  let res
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })
  describe('should get user data', () => {
    const req = {id: 1}
    
    const userData = {
      name: 'Test',
      position: 'Tester',
      email: 'test@email.com'
    }

    test('should return 200 with user data', async () => {
      User.findOne.mockImplementationOnce(() => userData)
      await getUser(req, res)
  
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({data:userData})
    })

    test('should return 400 invalid user', async () => {
      User.findOne.mockResolvedValue(null)
  
      await getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({error: true, message: 'invalid user'})
    })

  })

  describe('should update user data', () => {
    const req = {
      id: 1,
      body: {name: 'Test', position: 'Tester', email: 'tester@test.com'}
    }
    test('should return 200 when succeeded', async () => {
      userUpdate.mockResolvedValue({})
      await updateUser(req, res)
  
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ok: true})
    })

    test('should retun 409 duplicated email', async() => {
      userUpdate.mockResolvedValue('duplicatedEmail')
      await updateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({error: true, message: 'email is in use.'})
    })

    test('should return 500 internal server error', async () => {
      userUpdate.mockRejectedValue(new Error('internal server error'))
      await updateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({error: true})
      )
    })
  })

  describe('should delete user account', () => {
    const req = {id: 1}

    test('should return 204', async() => {
      res.clearCookie = jest.fn()
      res.sendStatus = jest.fn()

      User.destroy.mockResolvedValue({})
      await deleteAccount(req, res)
  
      expect(res.clearCookie).toHaveBeenCalledWith('token', {httpOnly:true})
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    test('should return 500 internal error', async() => {
      User.destroy.mockImplementationOnce(() => {
        throw new Error('Internal server error')
      })
      await deleteAccount(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({error: true})
      )
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})

