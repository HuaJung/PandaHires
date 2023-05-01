import { User } from "./db.js"
import bcrypt from "bcrypt"



const userRegister = async (userInfo) => {
  //encrypt the password
  const hashedPwd = await bcrypt.hash(userInfo.password, 10)

  //store the new user
  delete userInfo.timezoneOffset
  userInfo.password = hashedPwd
  console.log(userInfo)
  const newUser = await User.create(userInfo)
  return newUser
}


const userLogin = async (foundUser, password) => {
  const pwdMatch = await bcrypt.compare(password, foundUser.password)
  if (!pwdMatch) return {'message': 'email or password not correct'}
}


const userUpdate = async (userID, user) => {
  if (user.password) {
    const hashedPwd = await bcrypt.hash(user.password, 10)
    user.password = hashedPwd
  } else if (user.email) {
    const duplicate = await User.findOne({where: {email: user.email}})
    if (duplicate) return {'duplicated': true}
  }
  await User.update(user, {where: {id: userID}})
}


export {userRegister, userLogin, userUpdate}