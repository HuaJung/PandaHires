import express from "express"
import { companyValidator } from "../../controllers/validationController.js"
import {handleLogin, handleRegister, handleLogout, handleUser} from '../../controllers/authController.js'

