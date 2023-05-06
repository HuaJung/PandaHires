import express from "express"
import { companyValidator } from "../../controllers/validationController.js"
import { createNewCompany, getCompanyController, updateCompanyController, getCompanyNameId } from "../../controllers/companyController.js"


const companyRoute = express.Router()


companyRoute.route('/')
  .get(getCompanyNameId)
  .post(companyValidator, createNewCompany)

companyRoute.route('/settings')
  .get(getCompanyController)
  .patch(updateCompanyController)


export {companyRoute}