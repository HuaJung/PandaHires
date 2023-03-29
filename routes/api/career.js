import express from "express"
import { candidateUpdate } from "../../middleware/candidateUpdate.js"
import { candidateApply, careerAllJobs, careerSingleJob, careerCompany, updateResume } from "../../controllers/careerController.js"

const careerRoute = express.Router()


careerRoute.route('/')  //  querystring ?company=xxxxxx(companyName)
  .get(careerCompany)

careerRoute.route('/alljobs')  // querystring ?company=xxxxx(companyName)
  .get(careerAllJobs)

careerRoute.route('/singlejob')  //querystring ?job=xxxxx(id)
  .get(careerSingleJob)

careerRoute.route('/apply')   
  .post(candidateApply)  //querystring ?job=xxxxx(id)
  .patch(candidateUpdate, updateResume)   //querystring ?job=xxxxx(id)&candidate(id)


export { careerRoute }


