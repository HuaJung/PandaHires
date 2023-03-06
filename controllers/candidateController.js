import { Job, JobCandidate, Candidate, StageRecord, Stage, Company } from "../models/db.js";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { QueryTypes, Sequelize } from "sequelize";
import { sequelize } from "../models/dbConn.js";
// import multer from 'multer';
// const upload = multer({storage: storage})


dotenv.config()

const cloudfrontUrl = 'https://d1kd77tnohewk3.cloudfront.net'
const bucketName=process.env.BUCKET_NAME
const bucketRegion=process.env.BUCKET_REGION
const accessKey=process.env.ACCESS_KEY
const secretAccessKey=process.env.SECRET_ACCESS_KEY
const s3 = new S3Client({ 
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion 
});



const addNewCandidate = async(req, res) => {
  const jobID = Number(req.params.jobID)
  const companyID = Number(req.params.companyID)
  const candidate = req.body
  const resume = req.files
  console.log(resume)
  
  if (!resume || Object.keys(resume).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})
  
  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    const job = await Job.findByPk(jobID)
    if (job.companyId !== companyID) return res.status(400).json({'error': true, 'message': 'job doesn\'t exist'})
    
    // find all the jobs that candidate has applied
    const foundCandidate = await Candidate.findAll({
      where: {email: candidate.email, companyId: companyID},
      include: Job
    })
    candidate['companyId'] = companyID

    const resumeName = `resume-${Date.now()}.pdf`

    let jobCandidate
    let origin
    let originName
    if (Object.keys(candidate).includes('origin')) {
      origin = candidate.origin
      originName = candidate.originName
      delete candidate.origin
      delete candidate.originName
    } else {
      origin = 'Offical'
      originName = 'Website'
    }
    const jobCandidateAttributes = {
      resume: resumeName,
      origin: origin,
      originName: originName
    }


    if (foundCandidate.length > 0 ) {
      foundCandidate[0].jobs.forEach((job) => {
        if (job.id === jobID) throw 400  // alread existed
      })
      
      // don't know if candidate update info or not, still update anyway
      // save PDF to S3
      const params = {
        Bucket: bucketName,
        Key: `pandahires/${resumeName}`,
        Body: resume.data,
        ContentType: resume.mimetype
      };
      const putCommand = new PutObjectCommand(params);
      await s3.send(putCommand);

      await Candidate.update(candidate, { where: {id: foundCandidate[0].id}})
      const updatedCandidate = await Candidate.findByPk(foundCandidate[0].id)
      jobCandidate = await job.addCandidate(updatedCandidate, { through: jobCandidateAttributes})

    } else {
      // save PDF to S3
      const params = {
        Bucket: bucketName,
        Key: `pandahires/${resumeName}`,
        Body: resume.data,
        ContentType: resume.mimetype
      };
      const putCommand = new PutObjectCommand(params);
      await s3.send(putCommand);
      
      const createCandidate = await Candidate.create(candidate)
      // after create candidate, updating join talbe
      jobCandidate = await job.addCandidate(createCandidate, { through: jobCandidateAttributes})
    }
    
    
    const initialStage = await Stage.findByPk(1)
    await jobCandidate[0].addStage(initialStage)
    // await initialStage.addStage(jobCandidate)
    res.status(201).json({'ok': true})
  } catch (err) {
    if (err === 400) return res.status(400).json({'error': 'already applied'}) // then ask if still want to update resume
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getAllCandidates = async(req, res) => {
  const userID = req.id
  const {page, ...queries} =req.query
  if (!page) return res.status(400).json({'error': true, 'message': 'missing query'})
  const offset = (page-1)*10
  const limit = 10

  try {
    const allCandidates = await sequelize.query(
      `SELECT c.id ,c.firstName, c.lastName, GROUP_CONCAT(
        CONCAT_WS(",,", jc.id, jobs.name, jobs.status, jc.resume, jc.origin, jc.createdAt, stages.name, COALESCE(stages.status, 'N/A'), COALESCE(sr.interviewDate, 'N/A')) ORDER BY sr.createdAt DESC SEPARATOR ",,") AS jobDetails FROM candidates c 
        INNER JOIN jobCandidates jc ON c.id = jc.candidateID 
        INNER JOIN jobs ON jobs.id = jc.jobId 
        INNER JOIN (SELECT jobCandidateId, MAX(sr.createdAt) AS maxCreatedAt 
        FROM stageRecords sr GROUP BY jobCandidateId) latest_sr ON latest_sr.jobCandidateId= jc.id
        INNER JOIN stageRecords sr ON sr.jobCandidateId = jc.id AND sr.createdAt = latest_sr.maxCreatedAt
        INNER JOIN stages ON stages.id = sr.stageId
        INNER JOIN companies ON c.companyId = companies.id 
        WHERE companies.userId = ?
        GROUP BY c.id 
        ORDER BY MAX(sr.updatedAt) DESC
        LIMIT ? OFFSET ?`,
      {
        replacements: [userID, limit, offset],
        type: QueryTypes.SELECT
      }
    )

    if (allCandidates.length < 1) return res.status(200).json({'data': null})
    const candidates = allCandidates.map(({id, firstName, lastName, jobDetails}) => {
      return {
        id,
        firstName,
        lastName,
        jobs: jobDetails.split(',,').reduce((acc, curr, index, arr) => {
          if (index % 9 === 0) {
            // let interviewTimeFormat 
            const interviewTime  = arr[index+8]!== 'N/A'? arr[index+8].split(':')[0]+':'+arr[index+8].split(':')[1]: arr[index+8]
            // if(arr[index+8]!== 'N/A') {
            //   interviewTimeFormat= arr[index+8].split(':')[0]+':'+arr[index+8].split(':')[1]
            // }
            acc.push({
              jobCandidateId: parseInt(curr),
              jobName: arr[index+1],
              jobStatus: arr[index+2],
              resume: `${cloudfrontUrl}/${arr[index+3]}`,
              origin: arr[index+4],
              appliedDate: arr[index+5],
              stage: arr[index+6],
              stageStatus: arr[index+7],
              interviewDate: interviewTime
            })
          }
          return acc
        }, [])
      }
    })

    res.status(200).json({'data': candidates})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }

}

const getCandidate = async(req, res) => {
  const candidateID = req.params.candidateID
  console.log(candidateID)
  try {
    const singleCandidate = await Candidate.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email', 'country', 'city'],
      where: {id: candidateID},
      include: {
        model: JobCandidate, attributes: ['resume', 'origin', 'originName'], 
        include: [
          { model: Job, attributes: ['id', 'name'], required: true}, 
          { model: StageRecord, attributes: ['updatedAt'], requried: true,
            include: { model: Stage, attributes: ['name', 'status'], required: true}}
        ],
        required: true
      },
      order:[[JobCandidate, StageRecord, 'updatedAt', 'DESC']]
    })

    if (!singleCandidate) return res.status(400).json({'error': true, 'message': 'not exist'})
    
    const jobList = []
    singleCandidate.jobCandidates.forEach((job) => {
      const recordList = []
      job.stageRecords.forEach((record) => {
        const r = {
          'stage': record.stage.name,
          'status': record.stage.status === null? 'N/A': record.stage.status,
          'updatedAt': record.updatedAt
        }
        recordList.push(r)
      })
      const j = {
        'id': job.job.id,
        'name': job.job.name,
        'resume': `${cloudfrontUrl}/${job.resume}`,
        'origin': job.origin,
        'originName': job.originName,
        'stageRecord': recordList
      }
      jobList.push(j)
    })

    const data = {
      'id': singleCandidate.id,
      'firstName': singleCandidate.firstName,
      'lastName': singleCandidate.lastName,
      'city': singleCandidate.city,
      'country': singleCandidate.country,
      'email':singleCandidate.email,
      'job': jobList
    }

    res.status(200).json({'data': data})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const updateCandidate = async(req, res) => {
  const candidateID = req.params.candidateID
  const candidate = req.body
  
  if (Object.keys(candidate).length < 1) return res.status(400).json({'error': true, 'message': 'no fields to update'})

  let jobID
 
  try {
    if (candidate.origin && candidate.originName) {
      jobID = candidate.jobID
      await JobCandidate.update(
        {origin: candidate.origin, originName: candidate.originName}, 
        {where: {jobId: jobID, candidateId: candidateID}}
      )
      delete candidate.origin
      delete candidate.originName
      delete candidate.jobID

    } else if (candidate.origin || candidate.originName) return res.status(400).json({'error': true, 'message': 'both fields are required'})
  
    await Candidate.update(candidate, {where: {id: candidateID}})
    res.status(200).json({'ok': true})
    
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}  


const updateResume = async(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})

  let jobID
  // career page uses query string, recruiting page uses params
  if (req.query.id) {jobID = req.query.id} 
  else { jobID = req.params.jobID }

  try {
    const candidateID = req.params.candidateID
    const newResume = req.files.resume
    const newResumeName = `resume-${Date.now()}.pdf`
    const oldResume = await JobCandidate.findOne({
      attributes: ['resume'],
      where: {jobId: jobID , candidateId: candidateID}
    })
    if (!oldResume.resume) return res.status(404).json({'error': true, 'message': 'resume not found'})
  
    // update resume in S3
    const deleteParams = {
      Bucket: bucketName,
      Key: `pandahires/${oldResume.resume}`,
    }
    const updateParams = {
      Bucket: bucketName,
      Key: `pandahires/${newResumeName}`,
      Body: newResume.data,
      ContentType: newResume.mimetype
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams)
    const putCommand = new PutObjectCommand(updateParams);
    await s3.send(deleteCommand)
    await s3.send(putCommand)
  
    // update resume in RDS
    await JobCandidate.update(
      {resume: newResumeName}, 
      {where: {jobId: jobID , candidateId: candidateID}}
    )
    res.status(200).json({"ok": true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const deleteCandidate = async(req, res) => {
  const candidateID = req.params.candidateID
  try{
    const candidate = await Candidate.findByPk(candidateID)
    if (!candidate) return res.status(400).json({'error': true, 'message': 'not exist'})
    await Candidate.destroy({where: {id: candidateID}})
    res.status(200).json({"ok": true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }

}

const addNewStage = async(req, res) => {
  const jobCandidateIdList = req.body.jobCandidateId
  const stage = req.body.stage
  const interviewDate = req.body.interviewDate

  const foundStage = await Stage.findOne({where: stage})
  if (!foundStage) return res.status(400).json({'error': true, 'message': 'not a valid stage'})

  try {
    for (const id of jobCandidateIdList) {
      if (!await JobCandidate.findByPk(id)) throw 400

      await StageRecord.create({jobCandidateId: id, stageId: foundStage.id, interviewDate: interviewDate})
    }
    res.status(200).json({'ok': true})

  } catch (err) {
    if (err === 400) return res.status(400).json({'error': true, 'message': 'not valid candidate'})
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

export {addNewCandidate, getCandidate, updateCandidate, deleteCandidate, updateResume, getAllCandidates, addNewStage}