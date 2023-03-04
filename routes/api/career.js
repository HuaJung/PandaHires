import express from "express"
import { updateResume } from "../../controllers/candidateController.js"
import { candidateUpdate } from "../../middleware/candidateUpdate.js"
import { candidateApply, careerAllJobs, careerSingleJob, careerCompany } from "../../controllers/careerController.js"

const careerRoute = express.Router()

careerRoute.route('/')  //  query string ?company=xxxxxx(companyName)
  .get(careerCompany)

careerRoute.route('/alljobs')  // querystring?company=xxxxx(companyName)
  .get(careerAllJobs)

careerRoute.route('/singlejob')  //querystring ?id=xxxxx(jobID)
  .get(careerSingleJob)

careerRoute.route('/apply')   //querystring ?id=xxxxx(jobID)
  .post(candidateApply)
  .patch(candidateUpdate, updateResume)


export { careerRoute }


