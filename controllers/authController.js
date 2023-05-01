import { User } from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import { userRegister, userLogin } from '../models/userModel.js'
import jwt from "jsonwebtoken"


const handleRegister = async (req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': error})
  const userInfo = req.body

  try {
    const user = await userRegister(userInfo)
    const token = jwt.sign(
      {'id': user.id, 'timezoneoffset': userInfo.timezoneoffset}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 24*60*60*1000})
    res.status(201).json({ 'ok': true })

  } catch (err) {
      res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const handleLogin = async (req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': 'Email or password is incorrect'})

  const password = req.body.password
  const foundUser = req.foundUser
  try {
    const invalidUser = await userLogin(foundUser, password)
    if (invalidUser) return res.status(401).json({'error':true, 'message': invalidUser.message})

    const token = jwt.sign(
      {'id': foundUser.id, 'timezoneOffset': req.body.timezoneOffset}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 24*60*60*1000})
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getUserNameId = async (req, res) => {
  const userID = req.id
  const foundUser = await User.findByPk(userID)
  if (!foundUser) return res.status(400).json({'error': true, 'message': 'Invalid user ID'})
  res.status(200).json({'data': {'id': userID, 'name': foundUser.name}})
}


const handleLogout = async (req, res) => {
  res.clearCookie('token', {httpOnly: true})
  res.sendStatus(204)
}

export { handleRegister, handleLogin, getUserNameId, handleLogout }