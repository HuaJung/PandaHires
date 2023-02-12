import { Users, Companies} from '../models/db.js'
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authError } from './errorController.js'


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
  const duplicate = await Users.findOne({where: {email: email}})
  if (duplicate) return res.status(409).json({'error': true, 'message': {'email': 'email already exists.'}}); //Conflict 
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10)

    //store the new user
    const newUser = await Users.create({
      name: name,
      email: email,
      position: position,
      password: hashedPwd
    })
    const token = jwt.sign(
      {'id': newUser.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 7*24*60*60*1000})
    res.status(201).json({ 'ok': true })

  } catch (err) {
      res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const handleLogin = async (req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': error})
  
  const {email, password} = req.body
  const foundUser = await Users.findOne({where: {email: email}})
  if (!foundUser) return res.status(401).json({'error':true, 'message': 'email or password not correct'})
  const pwdMatch = await bcrypt.compare(password, foundUser.password)
  if (!pwdMatch) return res.status(401).json({'error':true, 'message': 'email or password not correct'})

  try {
    const token = jwt.sign(
      {'id': foundUser.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }
    )
    // saving refresh token with current user
    res.cookie('token', token, {httpOnly: true, maxAge: 7*24*60*60*1000})
    res.status(200).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const handleUserId = async (req, res) => {
  const userId = req.id 
  const foundUser = await Users.findByPk(userId)
  const user = {'id': foundUser.id }
  res.status(200).json({'data': {'user': user}})
}

const handleLogout = async (req, res) => {
  // res.cookie('token', '', { maxAge: -1})
  res.clearCookie('token', {httpOnly: true})
  return res.status(204).json({'ok': true})
}



const handleUserInfo = async (req, res) => {
  const userId = req.id 
  const foundUser = await Users.findByPk(userId)
  const user = {
    'id': foundUser.id,
    'name': foundUser.name,
    'position': foundUser.positoin,
    'image': foundUser.image
  }
  res.status(200).json({'data': {'user': user}})
}

const handleNewCompany = async(req, res) => {
  const error = authError(validationResult(req.body.company)) 
  if (error) return res.status(400).json({'error': true, 'message': error})

  const userId = req.body.user_id
  const {name, country, address, tel} = req.body.company
  const foundCompany = await Companies.findOne({where: {name: name}})
  if (foundCompany) return res.status(409).json({ 'error': true, 'message': 'company already exists' })
  try {
    await Companies.create({
      user_id: userId,
      name: name,
      country: country,
      address: address,
      tel: tel
    })
    res.status(201).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
} 

const handleCompanyName = async (req, res) => {
  const userId = req.id
  const foundCompany = await Companies.findOne({where: {user_id: userId}})
  if (!foundCompany) return res.status(400).json({'data': null})

  const company = {'id': foundCompany.id, 'name': foundCompany.name }
  res.status(200).json({'data': {'company': company}})

}

export { handleRegister, handleLogin, handleUserId, handleLogout, handleNewCompany, handleUserInfo, handleCompanyName }