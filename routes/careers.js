import express from "express"
import { careersAllJobs } from "../controllers/jobController.js"
import { Companies, Jobs } from "../models/db.js"

const careersRoute = express.Router()


careersRoute.get('/:companyName/about', async (req, res) => {
  const companyName = req.params.companyName
  const company = await Companies.findOne({where: {name: companyName}})
  res.render('frontend/about-company', {currentPage: 'About Us', jobName: false, companyName: companyName, company: company})
})

careersRoute.get('/:companyName/job_openings/:jobId/apply', async (req, res) => {
  const jobId = req.params.jobId
  const companyName = req.params.companyName
  const jobName = await Jobs.findOne({where: {id: jobId}, attributes: ['name']})
  res.render('frontend/apply', {
    jobName: jobName.name,
    companyName: companyName,
  })
})
careersRoute.get('/:companyName/job_openings/:jobId', async (req, res) => {
  const jobId = req.params.jobId
  const companyName = req.params.companyName
  const job = await Jobs.findOne({where: {id: jobId}})
  res.render('frontend/job-post', {
    jobName: job.name,
    companyName: companyName,
    job: job,
  })
})


careersRoute.get('/:companyName/job_openings', async (req, res) => {
  const companyName = req.params.companyName
  const company = await Companies.findOne({where: {name: companyName}, attributes:['id', 'name', 'country']})
  const allJobs = await Jobs.findAll({where: {company_id: company.id}})
  res.render('frontend/job-openings', {
    currentPage: 'All Jobs', 
    jobName: false,
    companyName: companyName,
    jobs: allJobs,
    company: company
  })
})



export {careersRoute}