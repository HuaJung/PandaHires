import express from "express"
import { registerValidator, loginValidator } from "../../controllers/validationController.js"
import {handleLogin, handleRegister, handleLogout, getUserNameId } from '../../controllers/authController.js'



const authRoute = express.Router()


authRoute.route('/')
  .get(getUserNameId)
  .post(registerValidator, handleRegister)
  .put(loginValidator, handleLogin)
  .delete(handleLogout)



export {authRoute}