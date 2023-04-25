import { Candidate, Job, JobCandidate } from "./db.js";
import { QueryTypes } from "sequelize";
import { sequelize } from "../models/dbConn.js";
import dotenv from 'dotenv';


dotenv.config()


const cloudfrontUrl = process.env.CLOUDFRONT_DOMAIN


const findCandidateToJob = async (email, companyID, jobID) => {
  return await Candidate.findOne({
    where: { email: email, companyId: companyID },
    include: {
      model: Job,
      where: {id: jobID},
      attributes:[]
    }
  })
}

const findCandidateByEmailAndCompanyId = async (email, companyID) => {
  return await Candidate.findOne({
    where: { email: email, companyId: companyID },
    include: Job
  })
}

const getCandidatesToJobToStage = async (userID, limit, offset) => {
  const allCandidateJobStage = await sequelize.query(
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
  if (allCandidateJobStage.length < 1) return allCandidateJobStage
  const sortedCandidates = allCandidateJobStage.map(({id, firstName, lastName, jobDetails}) => {
    return {
      id,
      firstName,
      lastName,
      jobs: jobDetails.split(',,').reduce((acc, curr, index, arr) => {
        if (index % 9 === 0) {
          const interviewTime  = arr[index+8]!== 'N/A'? arr[index+8].split(':')[0]+':'+arr[index+8].split(':')[1]: arr[index+8]
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
  return sortedCandidates
}


const getCandidate = async (candidateID) => {
  const singleCandidate = await Candidate.findOne({
    attributes: ['id', 'firstName', 'lastName', 'email', 'country', 'city'],
    where: {id: candidateID},
    include: {
      model: JobCandidate, 
      attributes: ['resume', 'origin', 'originName'], 
      include: [
        { model: Job, attributes: ['id', 'name'], required: true}, 
        { model: StageRecord, attributes: ['updatedAt'], requried: true,
          include: { model: Stage, attributes: ['name', 'status'], required: true}}
      ],
      required: true
    },
    order:[[JobCandidate, StageRecord, 'updatedAt', 'DESC']]
  })

  if (!singleCandidate) return singleCandidate
  
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
  return data
}

export {findCandidateToJob, findCandidateByEmailAndCompanyId, getCandidatesToJobToStage, getCandidate}