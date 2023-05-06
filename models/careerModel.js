import { Company, Job} from '../models/db.js'
import dotenv from 'dotenv'


dotenv.config()
const cloudfrontUrl = process.env.CLOUDFRONT_DOMAIN



const careerCompany = async (companyName) => {
  const company = await Company.findOne({
    attributes: {exclude: ['logoOriginName', 'imageOriginName', 'createdAt', 'updatedAt', 'userId']},
    where: {name: companyName}})
  if (company) {
    if (company.logo !== null) {
      company.logo = `${cloudfrontUrl}/${company.logo}`
    }
    if (company.image !== null) {
      company.image = `${cloudfrontUrl}/${company.image}`
    }
  }
  return company
}


const careerAllJobs = async (company) => {
  const allJobs = await Job.findAll({
    attributes: [
      'team', 'id', 'name', 'country', 'city', 'workType', 'employmentType', 'updatedAt'
    ],
    include: [
      {      
        model: Company,
        attributes: [],
        where: {name: company}
      }
    ],
    where: {status: 'Open'},
    order: [['team', 'ASC'], ['updatedAt', 'DESC']]
  })

  if (allJobs.length < 1) return allJobs
  const allJobsByTeams = {}
  allJobs.forEach(job => {
    const team = job.team
    if (!allJobsByTeams[team]) {
      allJobsByTeams[team] = []
    }
    allJobsByTeams[team].push({
      id: job.id,
      name: job.name,
      country: job.country,
      city: job.city,
      workType: job.workType,
      employmentType: job.employmentType,
      updatedAt: job.updatedAt
    })
  })
  const sortedJobs = Object.keys(allJobsByTeams).map((team) => {
    return {
      team: team,
      jobs:allJobsByTeams[team]
    }

  })

  return sortedJobs
}


export {careerCompany, careerAllJobs}