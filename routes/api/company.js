import express from "express"
import { companyValidator } from "../../controllers/validationController.js"
import { createNewCompany, getCompany, updateCompany, getCompanyNameId } from "../../controllers/companyController.js"


const companyRoute = express.Router()


companyRoute.route('/')
  .get(getCompanyNameId)
  .post(companyValidator, createNewCompany)

companyRoute.route('/settings')
  .get(getCompany)
  .patch(updateCompany)


export {companyRoute}