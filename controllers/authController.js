import { User } from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import { userRegister, userLogin } from '../models/userModel.js'
import jwt from "jsonwebtoken"


const handleRegister = async (req, res) => {
  const error = authError(validationResult(req)) 
  console.log(req.body)
  if (error) return res.status(400).json({'error': true, 'message': error})
  const userInfo = req.body

  // const { name, position, email, password } = req.body
  // const duplicate = await User.findOne({where: {email: email}})

  // if (duplicate) return res.status(409).json({'error': true, 'message': {'email': 'email already exists.'}}); //Conflict 
  // try {
  //   //encrypt the password
  //   const hashedPwd = await bcrypt.hash(password, 10)
  //   //store the new user
  //   const newUser = await User.create({
  //     name: name,
  //     email: email,
  //     position: position,
  //     password: hashedPwd
  //   })
  try {
    const user = await userRegister(userInfo)
    const token = jwt.sign(
      {'id': user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 24*60*60*1000})
    res.status(201).json({ 'ok': true })

  } catch (err) {
      res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const handleLogin = async (req, res) => {
  const error = authError(validationResult(req)) 
  console.log(req.body)
  if (error) return res.status(400).json({'error': true, 'message': 'Email or password is incorrect'})
  const {email, password} = req.body

  try {
    const user = await userLogin(email, password)
    if (!user) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

    if (user.message) return res.status(401).json({'error':true, 'message': user.message})
  // const foundUser = await User.findOne({where: {email: email}})
  // if (!foundUser) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

  // const pwdMatch = await bcrypt.compare(password, foundUser.password)
  // if (!pwdMatch) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

  // try {
    const token = jwt.sign(
      {'id': user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }
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