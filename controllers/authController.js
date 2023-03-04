import { User } from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const handleRegister = async (req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': error})

  const { name, position, email, password } = req.body
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({errors: errors.array()})
  // }
  // if (!name || !email || !position || !pwd) return res.status(400).json({ 'error': true, 'message': 'fields are required.' })
  // check for duplicate email in the db
  const duplicate = await User.findOne({where: {email: email}})
  if (duplicate) return res.status(409).json({'error': true, 'message': {'email': 'email already exists.'}}); //Conflict 
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10)

    //store the new user
    const newUser = await User.create({
      name: name,
      email: email,
      position: position,
      password: hashedPwd
    })
    const token = jwt.sign(
      {'id': newUser.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 24*60*60*1000})
    res.status(201).json({ 'ok': true })

  } catch (err) {
      res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const handleLogin = async (req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': error})
  const {email, password} = req.body

  const foundUser = await User.findOne({where: {email: email}})
  if (!foundUser) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

  const pwdMatch = await bcrypt.compare(password, foundUser.password)
  if (!pwdMatch) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

  try {
    const token = jwt.sign(
      {'id': foundUser.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }
    )
    // saving refresh token with current user
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
  // res.cookie('token', '', { maxAge: -1})
  res.clearCookie('token', {httpOnly: true})
  return res.status(204).json({'ok': true})
}

export { handleRegister, handleLogin, getUserNameId, handleLogout }