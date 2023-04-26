import { User } from "./db.js"
import bcrypt from "bcrypt"



const userRegister = async (userInfo) => {
  //encrypt the password
  const hashedPwd = await bcrypt.hash(userInfo.password, 10)

  //store the new user
  userInfo.password = hashedPwd
  const newUser = await User.create(userInfo)
  return newUser
}


const userLogin = async (email, password) => {
  // const foundUser = await User.findOne({where: {email: email}})
  // if (!foundUser) return foundUser

  const pwdMatch = await bcrypt.compare(password, foundUser.password)
  if (!pwdMatch) return {'message': 'email or password not correct'}
}


const userUpdate = async (userID, user) => {
  const foundUser = await User.findByPk(userID)
  if (!foundUser) return foundUser

  if (user.password) {
    const hashedPwd = await bcrypt.hash(user.password, 10)
    user.password = hashedPwd
  } else if (user.email) {
    const duplicate = await User.findOne({where: {email: user.email}})
    if (duplicate) return {'statusCode': 409}
  }
  await User.update(user, {where: {id: userID}})
}

export {userRegister, userLogin, userUpdate}