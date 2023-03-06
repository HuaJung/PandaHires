import { Candidate, Company, Job, Stage } from "../models/db.js"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
import { Sequelize } from "sequelize";


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



const careerCompany = async (req, res) => {
  const companyName = req.query.company
  const company = await Company.findOne({
    attributes: {exclude: ['logoOriginName', 'imageOriginName', 'createdAt', 'updatedAt', 'userId']},
    where: {name: companyName}})

  if (!company) return res.status(404).json({'data': null})

  if (company.logo !== null) {
    company.logo = `${cloudfrontUrl}/${company.logo}`
  }
  if (company.image !== null) {
    company.image = `${cloudfrontUrl}/${company.image}`
  }

  res.status(200).json({'data': company})
}

const careerAllJobs = async (req, res) => {
  // const companyName = req.query.company
  const {company, ...otherQuery} = req.query
  if (otherQuery) {
    otherQuery['name'] = company
  }
  const allJobs = await Job.findAll({
    attributes:['team', [Sequelize.fn('GROUP_CONCAT', 
    Sequelize.literal('CONCAT_WS(",,", job.id, job.name, job.country, job.city, workType, employmentType, job.updatedAt) ORDER BY job.updatedAt DESC SEPARATOR ",,"')), 'jobs']],
    include:[
      {
        model: Company,
        attributes:[],
        where: {name: company}
      }
    ],
    where: {status: 'Open'},
    group: ['team' ],
    raw: true
  })

  const jobs = allJobs.map(({team, jobs}) => {
    return {
      team,
      jobs: jobs.split(',,').reduce((acc, curr, index, arr) => {
        if (index % 7 === 0) {
          acc.push({
            id: parseInt(curr),
            name: arr[index+1],
            country: arr[index+2],
            city: arr[index+3],
            workType: arr[index+4],
            employmentType: arr[index +5],
            updatedAt: arr[index+6]
          })
        }
        return acc
      }, [])
    }
  })


  if (allJobs.length < 1) return res.status(200).json({'data': null})

  res.status(200).json({'data': jobs})
}

const careerSingleJob = async (req, res) => {
  const jobID = req.query.id
  const job = await Job.findOne({
    attributes: ['id', 'name', 'team', 'country', 'city', 'workType', 'employmentType', 'description', 'responsibility', 'qualification', 'preferred'],
    where: {id: jobID}
  })
  
  if (!job) return res.status(400).json({'error': true, 'message': 'not a valid job'})

  res.status(200).json({'data': job})
}

const candidateApply = async (req, res) => {
  const jobID = Number(req.query.id)
  const candidate = req.body

  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({'error': true, 'message': 'No file is uploaded'})
  
  if (Object.keys(candidate).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    let jobCandidate
    const job = await Job.findByPk(jobID)
    candidate['companyId'] = job.companyId
    const resume = req.files.resume
    const resumeName = `resume-${Date.now()}.pdf` 
    const jobCandidateAttributes = {
      resume: resumeName,
      origin: 'Official',
      originName: 'Website'
    }
    const foundCandidate = await Candidate.findAll({
      where: {email: candidate.email, companyId: job.companyId},
      include: Job
    })
    if (foundCandidate.length > 0) {
      foundCandidate[0].jobs.forEach((job) => {
        if (job.id === jobID) throw 400  // alread existed
      })

      await Candidate.update(candidate, { where: {id: foundCandidate[0].id}})
      const updatedCandidate = await Candidate.findByPk(foundCandidate[0].id)
      console.log('UPDATE CANDIDATE', JSON.stringify(updatedCandidate))
      jobCandidate = await job.addCandidate(updatedCandidate, { through: jobCandidateAttributes})
      console.log("jobcandidate",JSON.stringify(jobCandidate, null, 2))
    } else {
      const createCandidate = await Candidate.create(candidate)
      jobCandidate = await job.addCandidate(createCandidate, { through: jobCandidateAttributes})
 
    }
    const initialStage = await Stage.findByPk(1)
    await jobCandidate[0].addStage(initialStage)


    // save PDF to S3
    const params = {
      Bucket: bucketName,
      Key: `pandahires/${resumeName}`,
      Body: resume.data,
      ContentType: resume.mimetype
    };
    const putCommand = new PutObjectCommand(params);
    await s3.send(putCommand);

    res.status(201).json({'ok': true})

  } catch (err) {
    if (err === 400) return res.status(400).json({'error': 'already applied'}) // then ask if still want to update resume
    res.status(500).json({ 'error': true, 'message': err.message })
  }

}

export {candidateApply, careerAllJobs, careerSingleJob, careerCompany}