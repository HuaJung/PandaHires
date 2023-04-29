import { Company, Job} from '../models/db.js'
import { Sequelize } from 'sequelize'
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
  let allJobsByTeams
  if (allJobs.length >= 1) {
    allJobsByTeams = allJobs.map(({team, jobs}) => {
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
  }
  return allJobsByTeams
}


export {careerCompany, careerAllJobs}