import express from "express"
import { homePage, signInPage, signUpPage, signUpCompanyPage } from "../../controllers/pageController.js"
import { verifyJWT } from "../../middleware/verifyUser.js"

const router = express.Router()

router.get('/',homePage)

router.get('/signin', signInPage)

router.get('/signup', signUpPage)

router.get('/company_info', verifyJWT ,signUpCompanyPage)


export {router}