import express from "express"
import { addNewCandidate, getCandidateController, updateCandidateController, deleteCandidate, getAllCandidatesController, addNewStageController, updateApplication, udpateResumeController, updateOriginController } from "../../controllers/candidateController.js"


const candidateRoute = express.Router()


candidateRoute.route('/')  // query string page=xxx
  .get(getAllCandidatesController)

candidateRoute.route('/stage')  
  .post(addNewStageController)

candidateRoute.route('/:candidateID')
  .get(getCandidateController)
  .patch(updateCandidateController)
  .delete(deleteCandidate)

candidateRoute.route(':candidateID/:jobID')
  .patch(updateApplication)

candidateRoute.route('/:candidateID/:jobID/resume')  
  .patch(udpateResumeController)

candidateRoute.route('/:candidateID/:jobID/origin')
  .patch(updateOriginController)

candidateRoute.route('/:jobID')
  .post(addNewCandidate)




export {candidateRoute}