import express from "express"
import { registerValidator, loginValidator } from "../../controllers/validationController.js"
import {handleLogin, handleRegister, handleLogout, getUserNameId } from '../../controllers/authController.js'
import { verifyLogin } from "../../middleware/verifyUser.js"



const authRoute = express.Router()


authRoute.route('/')
  .get(verifyLogin, getUserNameId)
  .post(registerValidator, handleRegister)
  .put(loginValidator, handleLogin)
  .delete(handleLogout)



export {authRoute}