import { JobCandidate } from "./db.js"
import { S3Client,PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import dotenv from 'dotenv'


dotenv.config()

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



const addResumeAndOrigin = async (candidateID, jobID, candidate, resumeName) => {
  let jobCandidateAttributes = {
    resume: resumeName,
    origin: 'Official',
    originName: 'Website',
    jobId: jobID,
    candidateId: candidateID
  }
  if (candidate.origin && candidate.originName) {
    jobCandidateAttributes.origin = candidate.origin
    jobCandidateAttributes.originName = candidate.originName
  }

  const jobCandidate = await JobCandidate.create(jobCandidateAttributes)
  return jobCandidate
}


const updateResume = async(candidateID, jobID, newResume) => {
  const newResumeName = `resume-${Date.now()}.pdf`
  const oldResume = await JobCandidate.findOne({
    attributes: ['resume'],
    where: {jobId: jobID , candidateId: candidateID}
  })

  // update resume in S3
  if (oldResume.resume) {
    const deleteParams = {
      Bucket: bucketName,
      Key: `pandahires/${oldResume.resume}`,
    }
    const deleteCommand = new DeleteObjectCommand(deleteParams)
    await s3.send(deleteCommand)
  }
  const updateParams = {
    Bucket: bucketName,
    Key: `pandahires/${newResumeName}`,
    Body: newResume.data,
    ContentType: newResume.mimetype
  }
  const putCommand = new PutObjectCommand(updateParams);
  await s3.send(putCommand)

  await JobCandidate.update(
    {resume: newResumeName}, 
    {where: {jobId: jobID , candidateId: candidateID}}
  )
}



const updateOrigin = async (candidateID, jobID, candidate) => {
  await JobCandidate.update(
    {origin: candidate.origin, originName: candidate.originName}, 
    {where: {jobId: jobID, candidateId: candidateID}}
  )
}


const updateResumeAndOrigin = async(candidateID, jobID, candidate, newResume) => {
  const newResumeName = `resume-${Date.now()}.pdf`
  const oldResume = await JobCandidate.findOne({
    attributes: ['resume'],
    where: {jobId: jobID , candidateId: candidateID}
  })

  // update resume in S3
  if (oldResume.resume) {
    const deleteParams = {
      Bucket: bucketName,
      Key: `pandahires/${oldResume.resume}`,
    }
    const deleteCommand = new DeleteObjectCommand(deleteParams)
    await s3.send(deleteCommand)
  }
  const updateParams = {
    Bucket: bucketName,
    Key: `pandahires/${newResumeName}`,
    Body: newResume.data,
    ContentType: newResume.mimetype
  }
  const putCommand = new PutObjectCommand(updateParams);
  await s3.send(putCommand)

  // update resume and origin in JobCandidate Table
  const resumeOriginAttributes = {
    resume: newResumeName,
    origin: candidate.origin,
    originName: candidate.originName,
  }
  await JobCandidate.update(
    resumeOriginAttributes, 
    {where: {jobId: jobID , candidateId: candidateID}}
  )
  delete candidate.origin
  delete candidate.originName
  return candidate
}


export {updateResume, addResumeAndOrigin, updateResumeAndOrigin, updateOrigin}