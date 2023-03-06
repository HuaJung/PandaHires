import { Company, Job, JobCandidate, Candidate, StageRecord, Stage} from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'


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


const createNewCompany = async(req, res) => {
  const error = authError(validationResult(req.body)) 
  if (error) return res.status(400).json({'error': true, 'message': error})

  const userID = req.id
  const {name, country, address, tel} = req.body
  const foundCompany = await Company.findOne({where: {name: name}})
  if (foundCompany) return res.status(409).json({ 'error': true, 'message': 'company already exists' })
  try {
    await Company.create({
      userId: userID,
      name: name,
      country: country,
      address: address,
      tel: tel
    })
    res.status(201).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
} 

const getCompany = async (req, res) => {
  const userID = req.id
  const company = await Company.findOne({
    attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
    where: {userId: userID}})
  if (!company) return res.status(400).json({'data': null})

  company.logo = company.logo?`${cloudfrontUrl}/${company.logo}`:null
  company.image = company.image? `${cloudfrontUrl}/${company.image}`: null

  res.status(200).json({'data': company})
}

const getCompanyNameId = async(req,res) => {
  const userID = req.id
  const company = await Company.findOne({attributes:['id', 'name'], where: {userId: userID}})
  if (!company) return res.status(404).json({'data': null})

  res.status(200).json({'data': company})

}

const updateCompany = async (req, res) => {
  const userID = req.id
  const files = req.files
  let company = req.body

  if (Object.keys(company).length < 1 && !files) return res.status(400).json({'error': true, 'message': 'missing attributes'})

  try {    
    if (files) {
      const OldLogoOrImage = await Company.findOne({attributes: ['logo', 'image'], where: {userId: userID}})

      const updateParams = []
      const file = {}
      const fileOriginName = {}

      Object.entries(files).forEach(([key, value]) => {
        const param =  {
          Bucket: bucketName, 
          Key: `pandahires/${key}-${Date.now()}.${value.name.split('.')[1]}`,
          Body: value.data,
          ContentType: value.mimetype
        };
        updateParams.push(param)
        file[key]=`${key}-${Date.now()}.${value.name.split('.')[1]}`
        fileOriginName[`${key}OriginName`] = value.name
      })
      
      const deleteParams = Object.keys(file).map((key)=> {
        return {
          Bucket: bucketName,
          Key: `pandahires/${OldLogoOrImage[key]}`,
        }
      })
      updateParams.forEach(async(param) => await s3.send(new PutObjectCommand(param)))
      deleteParams.forEach(async(param) => await s3.send(new DeleteObjectCommand(param)))


      Object.assign(company, file, fileOriginName)
      console.log(company)
    } 
    await Company.update(company, {where: {userId: userID}})
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const getAllJobsCandidates = async (req, res) => {
  const companyID = req.params.companyID
  try {
    const allJobsCandidates = await Job.findAll({
      attributes: ['id', 'name','team', 'country', 'city', 'workType', 'employmentType', 'status', 'delete'],
      where: {companyId: companyID, status: 'Published'},
      include: {
        model: JobCandidate,
        attributes: ['resume', 'origin', 'createdAt'],
        include: [
          { model: Candidate, 
            attributes: ['id', 'firstName', 'lastName', 'email', 'country', 'city'], 
            requried: true },
          { model: StageRecord, attributes: ['createdAt'], required: true,
            include: { model: Stage, attributes: ['name', 'status'], required: true }
          }
        ],
        required: true
      },
 
      order:[['team', 'ASC']]

    })
    if (allJobsCandidates.length < 1) return res.status(200).json({'data': null})

    const data = []
    allJobsCandidates.forEach(job => {
      const candidateList = []
      job.jobCandidates.forEach((candidate) => {
        const latestRecord = candidate.stageRecords[candidate.stageRecords.length-1]
        const c = {
          'id': candidate.candidate.id,
          'firstName': candidate.candidate.firstName,
          'lastName': candidate.candidate.lastName,
          'email': candidate.candidate.email,
          'country': candidate.candidate.country,
          'city': candidate.candidate.city,
          'resume': `${cloudfrontUrl}/${candidate.resume}`,
          'origin': candidate.origin,
          'appliedDate': candidate.createdAt,
          'currentStage': latestRecord.stage.name,
          'currentStatus': latestRecord.stage.status === null? ' ': latestRecord.stage.status,
          'stageUpdate': latestRecord.createdAt
        }
        candidateList.push(c)
      })
      const j = {
        'id': job.id,
        'name': job.name,
        'country': job.country,
        'city': job.city,
        'workType': job.workType,
        'employmentType': job.employmentType,
        'status': job.status,
        'delete': job.delete,
        'candidate': candidateList
      }
      data.push(j)
    });

    res.status(200).json({'data': data})
    
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}



export {createNewCompany, getCompany, updateCompany, getAllJobsCandidates, getCompanyNameId}