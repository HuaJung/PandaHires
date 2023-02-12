import express from "express"
import { handleNewJob, handleCloseJob, handleOneJob, handleJobUpdate } from "../../controllers/jobController.js"


const jobRoute = express.Router()


jobRoute.get('/:companNname/jobs/:jobId', handleOneJob)
jobRoute.delete('/:companNname/jobs/:jobId', handleCloseJob)
jobRoute.patch('/:companNname/jobs/:jobId', handleJobUpdate)

jobRoute.get('/:companNname/jobs' )
jobRoute.post('/:companNname/jobs', handleNewJob)

export {jobRoute}