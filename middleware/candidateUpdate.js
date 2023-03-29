import { Candidate, Job } from "../models/db.js"



const candidateUpdate = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  const candidateID = req.query.candidate
  const candidate = req.body

  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {    
    await Candidate.update(candidate, {where: {id: candidateID}})
    next()

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


export {candidateUpdate}