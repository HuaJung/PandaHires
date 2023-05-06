import { Company} from '../models/db.js'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'

dotenv.config()
const cloudfrontUrl = process.env.CLOUDFRONT_DOMAIN
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


const updateCompany = async (files, userID, company) => {
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
      }
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
}


const getCompany = async (userID) => {
  const company = await Company.findOne({
    attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
    where: {userId: userID}})
  if (company) {
    company.logo = company.logo?`${cloudfrontUrl}/${company.logo}`:null
    company.image = company.image? `${cloudfrontUrl}/${company.image}`: null
  }
  return company
}

export {updateCompany, getCompany}