import express from "express"
import { addNewCandidate, getCandidate, updateCandidate, deleteCandidate, updateResume, getAllCandidates, addNewStage } from "../../controllers/candidateController.js"


const candidateRoute = express.Router()



candidateRoute.route('/')  // query string page=xxx
  .get(getAllCandidates);


candidateRoute.route('/:candidateID')
  .get(getCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);


candidateRoute.route('/:candidateID/:jobID/resume')  
  .get()
  .patch(updateResume);

  
candidateRoute.route('/stage')  
  .post(addNewStage);


candidateRoute.route('/:companyID/:jobID')
  .post(addNewCandidate);





export {candidateRoute}