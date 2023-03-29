import { User } from '../models/db.js'
import bcrypt from "bcrypt"



const getUser = async (req, res) => {
  const userID = req.id
  const user = await User.findOne({attributes: ['name', 'position', 'email'], where: {id: userID}})
  if (!user) return res.status.json({'error': true, 'message': 'invalid user'})

  res.status(200).json({'data':  user})
}


const updateUser = async (req, res) => {
  const userID = req.id
  const user = req.body
  const foundUser = await User.findByPk(userID)
  if (!foundUser) return res.status.json({'error': true, 'message': 'invalid user'})

  if (user.password) {
    const hashedPwd = await bcrypt.hash(user.password, 10)
    await User.update({password: hashedPwd}, {where: {id: userID}})
    return res.status(200).json({'ok': true})

  } else if (user.email) {
    const duplicate = await User.findOne({where: {email: email}})
    if (duplicate) return res.status(409).json({'error': true, 'message': {'email': 'email is in use.'}}); //Conflict 
  }
  await User.update(user, {where: {id: userID}})
  res.status(200).json({'ok': true})
}


const deleteAccount = async (req, res) => {
  const userID = req.id
  const foundUser = await User.findByPk(userID)
  if (!foundUser) return res.status.json({'error': true, 'message': 'invalid user'})
  
  await User.destroy({where: {id: userID}})
  res.clearCookie('token', {httpOnly: true})
  res.sendStatus(204)
}

export {getUser, updateUser, deleteAccount}