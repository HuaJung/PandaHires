import express from "express"
import { careersSingleJobPage, careersAboutPage, careerJobOpeningsPage } from "../../controllers/pageController.js"


const careersRoute = express.Router()

careersRoute.get('/:companyName/jobs', careerJobOpeningsPage)

careersRoute.get('/:companyName/about', careersAboutPage)

careersRoute.get('/:companyName/jobs/:jobId', careersSingleJobPage)



export {careersRoute}