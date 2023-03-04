import { Candidate, Job } from "../models/db.js"

const candidateUpdate = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  const jobID = req.query.id
  const candidate = req.body

  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  const job = await Job.findByPk(jobID)
  const companyID = job.companyId

  try {
    const foundCandidate = await job.getCandidates({where: {email: candidate.email}})
    // console.log(JSON.stringify(foundCandidate, null, 2))
    if(foundCandidate.length < 1) return res.status(400).json({'error': 'not apply yet'})
    
    await Candidate.update(candidate, {where: {email: candidate.email, companyId: companyID}})
    req.params.candidateID = foundCandidate[0].id
    next()

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}



export {candidateUpdate}