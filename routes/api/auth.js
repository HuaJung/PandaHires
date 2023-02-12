import express from "express"
import { registerValidator, loginValidator, companyValidator } from "../../controllers/validationController.js"
import {handleLogin, handleRegister, handleLogout, handleUserInfo, handleNewCompany, handleUserId, handleCompanyName} from '../../controllers/authController.js'
import { verifyJWT, checkUser } from "../../middleware/verifyUser.js"

const authRoute = express.Router()

authRoute.get('/', checkUser, handleUserId )
authRoute.post('/', registerValidator, handleRegister)
authRoute.put('/', loginValidator, handleLogin)
authRoute.delete('/', handleLogout)

authRoute.get('/company', verifyJWT, handleCompanyName)
authRoute.post('/company', verifyJWT, companyValidator, handleNewCompany)

authRoute.get('/user', verifyJWT, handleUserInfo)

export {authRoute}