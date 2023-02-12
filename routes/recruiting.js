import express from "express"
import { createCandidatePage, createJobPage, editCandidatePage } from "../controllers/pageController.js"
import { handleAllJobs, handlePreviewJob, handleOneJob, handleEditPreviewJob } from "../controllers/jobController.js"

const recruitRoute = express.Router()

recruitRoute.get('/dashboard', handleAllJobs)

recruitRoute.get('/create_job', createJobPage)

recruitRoute.get('/edit_job/:jobId', handleOneJob)

recruitRoute.get('/edit_job/:jobId/preview', handleEditPreviewJob)

recruitRoute.get('/add_candidate', createCandidatePage)

recruitRoute.get('/edit_candidate', editCandidatePage)

recruitRoute.get('/preview_job', handlePreviewJob)



export {recruitRoute}