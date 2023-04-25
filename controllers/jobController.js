import { Company, Job } from "../models/db.js";
import { allJobs, overviewJobs } from "../models/jobModel.js";



const createNewJob = async (req, res) => {
  const userID = req.id
  const job = req.body
  const userCompany = await Company.findOne({where: {userId: userID}})
  if (userCompany.id !== job.companyId) return res.status(400).json({'error': true, 'message': 'invalid company'})

  if (Object.keys(job).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    await Job.create(job)
    res.status(201).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getAllJobs = async (req, res) => {
  const userID = req.id
  const {page, ...queries} =req.query
  if (!page) return res.status(400).json({'error': true, 'message': 'missing query'})

  const offset = (page-1)*10
  const limit = 10
  const offerStage = 22
  const sortedJobs = await allJobs(offerStage, userID, limit, offset)

  if (sortedJobs.length < 1) return res.status(200).json({'data': null}) 

  res.status(200).json({'data': sortedJobs})
}


const getOpenJobs = async(req, res) => {
  const userID = req.id
  const jobs = await Job.findAll({
    attributes:['id', 'team', 'name', 'country', 'city', 'workType', 'employmentType', 'updatedAt'],
    where: {status: 'Open'},
    include: {
      model: Company, 
      where: {userId: userID},
      attributes:[]
    }
  })
  if (jobs.length < 1) return res.status(200).json({'data': null}) 

  res.status(200).json({'data': jobs})
}


const getJob = async (req, res) => {
  const jobID = req.params.jobID
  const job = await Job.findOne({
    attributes: {exclude: ['createdAt', 'updatedAt', 'companyId', 'status']},
    where: {id: jobID}
  })
  if (!job) return res.status(400).json({'error': true, 'message': 'not a valid job'})
  res.status(200).json({'data': job})
}


const updateJob = async (req, res) => {
  const jobID = req.params.jobID
  const job = req.body
  try {
    await Job.update(job, {where: {id: jobID}})
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getOverviewJobs = async (req, res) => {
  const userID = req.id
  try {
    const sortedJobs = await  overviewJobs(userID)

    if (sortedJobs.length < 1) return res.status(200).json({'data': null}) 

    res.status(200).json({'data': sortedJobs })
    
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


export {getAllJobs, createNewJob , updateJob, getJob, getOpenJobs, getOverviewJobs}