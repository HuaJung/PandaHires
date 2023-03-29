import { Company, Job, JobCandidate, Candidate, StageRecord, Stage} from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

  const company = req.body
  company['userId'] = req.id

  const foundCompany = await Company.findOne({where: {name: company.name}})
  if (foundCompany) return res.status(409).json({ 'error': true, 'message': 'company already exists' })

  try {
    await Company.create(company)
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


const getCompanyNameId = async (req,res) => {
  const userID = req.id
  const company = await Company.findOne({attributes:['id', 'name'], where: {userId: userID}})
  if (!company) return res.status(404).json({'data': null})

  res.status(200).json({'data': company})
}


const updateCompany = async (req, res) => {
  const userID = req.id
  const files = req.files
  const company = req.body

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
        file[key] = `${key}-${Date.now()}.${value.name.split('.')[1]}`
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
    } 
    await Company.update(company, {where: {userId: userID}})
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}



export {createNewCompany, getCompany, updateCompany, getCompanyNameId}