import express from "express"
import { addNewCandidate, getCandidate, updateCandidate, deleteCandidate, getAllCandidates, addNewStage } from "../../controllers/candidateController.js"
import { updateResume } from "../../controllers/careerController.js"


const candidateRoute = express.Router()


candidateRoute.route('/')  // query string page=xxx
  .get(getAllCandidates);

candidateRoute.route('/:candidateID')
  .get(getCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);

candidateRoute.route('/:candidateID/:jobID/resume')  
  .patch(updateResume);

candidateRoute.route('/stage')  
  .post(addNewStage);

candidateRoute.route('/:jobID')
  .post(addNewCandidate);




export {candidateRoute}