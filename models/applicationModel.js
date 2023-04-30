import { Job, Candidate, Stage} from '../models/db.js'
import { S3Client,PutObjectCommand } from "@aws-sdk/client-s3"
import { findCandidateByEmailAndCompanyId } from './candidateModel.js'
import { addResumeAndOrigin } from './candidateToJobModel.js'
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



const jobApplication = async (jobID, candidate, resume) => {
  let resumeAdded
  const job = await Job.findByPk(jobID)
  candidate['companyId'] = job.companyId
  const resumeName = `resume-${Date.now()}.pdf` 
  const foundCandidate = await findCandidateByEmailAndCompanyId(candidate.email, job.companyId)

  if (!foundCandidate) {
    const createCandidate = await Candidate.create(candidate)
    resumeAdded = await addResumeAndOrigin(createCandidate.id, jobID, candidate, resumeName )
  } else {
    const candidateID = foundCandidate.id
    for (const job of foundCandidate.jobs) {
      if (job.id === jobID) throw {'message': 'Already Applied','candidateId':candidateID}
    }
    await Candidate.update(candidate, {where: {id: candidateID}})
    resumeAdded = await addResumeAndOrigin(candidateID, jobID, candidate, resumeName)
  }
  // save PDF to S3
  const params = {
    Bucket: bucketName,
    Key: `pandahires/${resumeName}`,
    Body: resume.data,
    ContentType: resume.mimetype
  }
  const putCommand = new PutObjectCommand(params);
  await s3.send(putCommand)

  const initialStage = await Stage.findByPk(1)
  await resumeAdded.addStage(initialStage)
}

export { jobApplication}