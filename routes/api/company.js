import express from "express"
import { companyValidator } from "../../controllers/validationController.js"
import { createNewCompany, getCompany, updateCompany, getAllJobsCandidates, getCompanyNameId } from "../../controllers/companyController.js"


const companyRoute = express.Router()

companyRoute.route('/')
  .get(getCompanyNameId)
  .post(companyValidator, createNewCompany)


companyRoute.route('/settings')
  .get(getCompany)
  .patch(updateCompany)


companyRoute.route('/:companyID/overview')
  .get(getAllJobsCandidates)




export {companyRoute}