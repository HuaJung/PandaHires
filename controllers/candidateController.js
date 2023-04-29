import { Job, Candidate } from "../models/db.js"
import { updateResume, updateResumeAndOrigin, updateOrigin } from "../models/candidateToJobModel.js"
import { getCandidatesToJobToStage, getCandidate } from "../models/candidateModel.js"
import { jobApplication } from "../models/applicationModel.js"
import { addNewStageRecord } from "../models/stageModel.js"



const addNewCandidate = async (req, res) => {
  const jobID = Number(req.params.jobID)
  const candidate = req.body
  const job = await Job.findByPk(jobID)

  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  if (!job) return res.status(400).json({'error': true, 'message': 'job doesn\'t exist'})
  
  const companyID = job.companyId
  candidate['companyId'] = companyID
  const resume = req.files.resume

  try {
    await jobApplication(jobID, candidate, resume)
    res.status(201).json({'ok': true})

  } catch (err) {
    if (err.message === 'Already Applied') return res.status(400).json({'error': true, 'message': 'The candidate already applied the job', 'candidateId': err.candidateId})
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getAllCandidatesController = async(req, res) => {
  const userID = req.id
  const {page, ...queries} =req.query
  if (!page) return res.status(400).json({'error': true, 'message': 'missing query'})
  
  const offset = (page-1)*10
  const limit = 10

  try {
    const allCandidates = await getCandidatesToJobToStage(userID, limit, offset)
    if (allCandidates.length < 1) return res.status(200).json({'data': null})
    res.status(200).json({'data': allCandidates})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }

}


const getCandidateController = async(req, res) => {
  const candidateID = req.params.candidateID
  try {
    const singleCandidate = await getCandidate(candidateID)
    if (!singleCandidate) return res.status(400).json({'error': true, 'message': 'not exist'})
    res.status(200).json({'data': data})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const updateApplication = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  const candidateID = req.params.candidate
  const jobID = req.params.job
  const candidate = req.body
  const newResume = req.files.resume

  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    const candidateWithoutResumeAndOrigin = await updateResumeAndOrigin(candidateID, jobID, candidate, newResume)

    await Candidate.update(candidateWithoutResumeAndOrigin, {where: {id: candidateID}})
    res.status(200).json({"ok": true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const updateCandidateController = async(req, res) => {
  const candidateID = req.params.candidateID
  const candidate = req.body
  
  if (Object.keys(candidate).length < 1) return res.status(400).json({'error': true, 'message': 'no fields to update'})

  try {
    await Candidate.update(candidate, {where: {id: candidateID}})
    res.status(200).json({'ok': true})
    
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}  


const udpateResumeController = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  const candidateID = req.params.candidate
  const jobID = req.params.job
  const newResume = req.files.resume
  try {
    await updateResume(candidateID,jobID, newResume)
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const updateOriginController = async (req, res) => {
  const candidateID = req.params.candidate
  const jobID = req.params.job
  const candidate = req.body

  try {
    if (candidate.origin && candidate.originName) {
      await updateOrigin(candidateID, jobID, candidate)
      res.status(200).json({'ok': true})

    } else {
      res.status(400).json({'error': true, 'message': 'missing fields'})
    }
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const deleteCandidate = async(req, res) => {
  const candidateID = req.params.candidateID
  try {
    const candidate = await Candidate.findByPk(candidateID)
    if (!candidate) return res.status(400).json({'error': true, 'message': 'not exist'})
    await Candidate.destroy({where: {id: candidateID}})
    res.status(200).json({"ok": true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const addNewStageController = async(req, res) => {
  const jobCandidateIdList = req.body.jobCandidateId
  const stage = req.body.stage
  const interviewDate = req.body.interviewDate

  try {
    const addStageRecord = await addNewStageRecord(jobCandidateIdList, stage, interviewDate)
    if (!addStageRecord)return res.status(400).json({'error': true, 'message': 'not a valid stage'})

    res.status(200).json({'ok': true})

  } catch (err) {
    if (err.message === 'Not a valid application') return res.status(400).json({'error': true, 'message': err.message})
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

export {addNewCandidate, getCandidateController, updateCandidateController, deleteCandidate, getAllCandidatesController, addNewStageController, updateApplication, updateOriginController, udpateResumeController}