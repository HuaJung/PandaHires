import express from "express"
import { careerApplyForJob, careerAllJobsController, careerSingleJob, careerCompanyController, careerUpdateApplication } from "../../controllers/careerController.js"

const careerRoute = express.Router()


careerRoute.route('/')  //  querystring ?company=xxxxxx(companyName)
  .get(careerCompanyController)

careerRoute.route('/alljobs')  // querystring ?company=xxxxx(companyName)
  .get(careerAllJobsController)

careerRoute.route('/singlejob')  //querystring ?job=xxxxx(id)
  .get(careerSingleJob)

careerRoute.route('/apply')   
  .post(careerApplyForJob)  //querystring ?job=xxxxx(id)
  .patch(careerUpdateApplication)   //querystring ?job=xxxxx(id)&candidate(id)


export { careerRoute }


