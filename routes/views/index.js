import express from "express"
import { homePage, signInPage, signUpPage, signUpCompanyPage } from "../../controllers/pageController.js"

const router = express.Router()

router.get('/',homePage)

router.get('/signin', signInPage)

router.get('/signup', signUpPage)

router.get('/company_info', signUpCompanyPage)


export {router}