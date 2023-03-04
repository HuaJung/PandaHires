import express from "express"
import { addCandidatePage, createJobPage, dashboardPage, editCandidatePage, settingPage, previewJobPage, editJobPage } from "../../controllers/pageController.js"


const recruitRoute = express.Router()

recruitRoute.get('/dashboard', dashboardPage)

recruitRoute.get('/settings', settingPage)

recruitRoute.get('/create_job', createJobPage)

recruitRoute.get('/create_job/preview', previewJobPage)

recruitRoute.get('/edit_job/:jobID', editJobPage)

recruitRoute.get('/edit_job/:jobId/preview', previewJobPage)

recruitRoute.get('/add_candidate', addCandidatePage)

recruitRoute.get('/edit_candidate', editCandidatePage)

recruitRoute.get('/candidates/:candidateId')



export {recruitRoute}