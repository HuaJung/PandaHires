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
    `SELECT c.id, c.firstName, c.lastName, jc.id AS jobCandidateId, 
      j.name, j.status AS jobStatus, jc.resume, jc.origin, jc.createdAt, s.name AS stage, 
      COALESCE(s.status, '-') AS status, 
      COALESCE(sr.interviewDate, '-') AS interviewDate
    FROM candidates c
    INNER JOIN jobCandidates jc ON c.id = jc.candidateID
    INNER JOIN jobs j ON j.id = jc.jobId
    INNER JOIN stageRecords sr ON sr.jobCandidateId = jc.id
    INNER JOIN (
      SELECT jobCandidateId, MAX(sr.createdAt) AS latestRecord
        FROM stageRecords sr 
        GROUP BY jobCandidateId
    ) latestSr ON latestSr.jobCandidateId = sr.jobCandidateId AND latestSr.latestRecord = sr.createdAt
    INNER JOIN stages s ON s.id = sr.stageId
    INNER JOIN companies ON c.companyId = companies.id
    WHERE companies.userId = ?
    ORDER BY jc.createdAt DESC, c.id ASC
    LIMIT ? OFFSET ?`,
    {
      replacements: [userID, limit, offset],
      type: QueryTypes.SELECT
    }
  )
  if (allCandidateJobStage.length < 1) return allCandidateJobStage

  const sortedCandidates = allCandidateJobStage.reduce((acc, candidate) => {
    const candidateId = acc.findIndex((item)=> item.id === candidate.id)
    const jobData = {
      jobCandidateId: candidate.jobCandidateId,
      jobName: candidate.name,
      jobStatus: candidate.jobStatus,
      resume: `${cloudfrontUrl}/${candidate.resume}`,
      origin: candidate.origin,
      appliedDate: candidate.createdAt,
      stage: candidate.stage,
      stageStatus: candidate.status,
      interviewDate: candidate.interviewDate
    }
    if(candidateId !== -1) {
      acc[candidateId].jobs.push(jobData)
    } else {
      acc.push(
        {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          jobs: [jobData]
        }
      )
    }
    return acc
  }, [])
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