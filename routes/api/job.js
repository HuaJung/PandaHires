import express from "express"
import { getAllJobs, createNewJob, updateJob, getJob, getOpenJobs, getOverviewJobs } from "../../controllers/jobController.js"


const jobRoute = express.Router()


jobRoute.route('/all')  // ?page=1 or ....
  .get(getAllJobs)

jobRoute.route('/openings')  // candidate form would call this 
  .get(getOpenJobs)

jobRoute.route('/create')
  .post(createNewJob)

jobRoute.route('/overview')
  .get(getOverviewJobs)

jobRoute.route('/:jobID')
  .get(getJob)
  .patch(updateJob)



export {jobRoute}