import { Candidate, Company, Job, Stage, JobCandidate } from "../models/db.js"
import { careerCompany, careerAllJobs } from "../models/careerModel.js"
import { updateResume } from "../models/candidateToJobModel.js"
import { jobApplication } from "../models/applicationModel.js"



const careerCompanyController = async (req, res) => {
  const companyName = req.query.company
  try {
    const company = await careerCompany(companyName)

    if (!company) return res.status(404).json({'data': null})
  
    res.status(200).json({'data': company})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const careerAllJobsController = async (req, res) => {
  const {company, ...otherQuery} = req.query
  if (!company) return res.status(400).json({'error': true, 'message': 'missing query'})

  const allJobs = await careerAllJobs(company)
  if (allJobs.length < 1) return res.status(200).json({'data': null})

  res.status(200).json({'data': allJobs})
}


const careerSingleJob = async (req, res) => {
  const jobID = req.query.job
  const job = await Job.findOne({
    attributes: ['id', 'name', 'team', 'country', 'city', 'workType', 'employmentType', 'description', 'responsibility', 'qualification', 'preferred'],
    where: {id: jobID}
  })
  if (!job) return res.status(400).json({'error': true, 'message': 'not a valid job'})

  res.status(200).json({'data': job})
}


const careerApplyForJob = async (req, res) => {
  const jobID = Number(req.query.job)
  const candidate = req.body

  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})
  
  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    const resume = req.files.resume

    await jobApplication(jobID, candidate, resume)
    res.status(201).json({'ok': true})

  } catch (err) {
    if (err.message === 'Already Applied') return res.status(400).json({'error': true, 'message': 'You already applied the job', 'candidateId': err.candidateId}) 
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const careerUpdateApplication = async(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  const candidateID = req.query.candidate
  const jobID = req.query.job
  const candidate = req.body
  const newResume = req.files.resume

  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    await Candidate.update(candidate, {where: {id: candidateID}})
    await updateResume(jobID, candidateID, newResume)

    res.status(200).json({"ok": true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}



export {careerApplyForJob, careerAllJobsController, careerSingleJob, careerCompanyController, careerUpdateApplication}