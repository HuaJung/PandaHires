import { QueryTypes } from "sequelize";
import { sequelize } from "../models/dbConn.js";
import { Company, Job } from "../models/db.js";



const createNewJob = async (req, res) => {
  const userID = req.id
  const job = req.body
  const userCompany = await Company.findOne({where: {userId: userID}})
  if (userCompany.id !== job.companyId) return res.status(400).json({'error': true, 'message': 'invalid company'})

  if (Object.keys(job).length < 6) return res.status(400).json({'error': true, 'message': 'missing fields'})

  try {
    await Job.create(job)
    res.status(201).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getAllJobs = async (req, res) => {
  const userID = req.id
  const {page, ...queries} =req.query
  if (!page) return res.status(400).json({'error': true, 'message': 'missing query'})
  const offset = (page-1)*10
  const limit = 10
  const offerStage = 22
  const allJobs = await sequelize.query( 
    `SELECT jobs.id, jobs.team, jobs.name, jobs.workType, jobs.employmentType, jobs.updatedAt, 
    COALESCE(COUNT(jc.candidateId), 0) AS applicants,
    COALESCE(interviewCount, 0) AS interviewCount, 
    COALESCE(offerCount, 0) AS offerCount 
    FROM jobs 
    LEFT JOIN (
      SELECT jc.jobId, COUNT(*) AS interviewCount 
      FROM (
        SELECT jobCandidateId, MAX(sr.createdAt) AS latest_valid_interview 
        FROM stageRecords sr INNER JOIN stages ON sr.stageId = stages.id 
        WHERE stages.status LIKE '%Scheduled%' 
        GROUP BY jobCandidateId
        ) AS latest_interview_records 
      INNER JOIN jobCandidates jc ON jc.id = latest_interview_records.jobCandidateId 
      GROUP BY jc.jobId
      ) AS interview_counts ON interview_counts.jobId = jobs.id 
    LEFT JOIN (
      SELECT jc.jobID, COUNT(*) AS offerCount 
      FROM stageRecords sr 
      INNER JOIN stages ON sr.stageId = stages.id 
      INNER JOIN jobCandidates jc ON jc.id = sr.jobCandidateId 
      WHERE stages.id = ? 
      GROUP BY jc.jobId
      ) AS offer_counts ON offer_counts.jobId = jobs.Id 
    LEFT JOIN jobCandidates jc ON jobs.id = jc.jobId  
    INNER JOIN companies ON jobs.companyId = companies.id 
    INNER JOIN users ON users.id = companies.userId 
    WHERE companies.userId = ? AND jobs.status = 'Open' 
    GROUP BY jobs.id 
    ORDER BY jobs.updatedAt 
    DESC LIMIT ? OFFSET ?`,
   {
    replacements:[offerStage, userID, limit, offset],
    type: QueryTypes.SELECT
  })

  if (allJobs.length < 1) return res.status(200).json({'data': null}) 

  const jobsByTeam = allJobs.reduce((acc, job) => {
    if (!acc[job.team]) {
      acc[job.team] = { team: job.team, jobs: [] };
    }
    acc[job.team].jobs.push({
      id: job.id,
      name: job.name,
      workType: job.workType,
      employmentType: job.employmentType,
      updatedAt: job.updatedAt,
      applicants: job.applicants,
      interviewCount: job.interviewCount,
      offerCount: job.offerCount,
    });
    return acc;
  }, {});

  const sortedJobs = Object.values(jobsByTeam).sort((a, b) => a.team.localeCompare(b.team));

  res.status(200).json({'data': sortedJobs})
}


const getOpenJobs = async(req, res) => {
  const userID = req.id
  const jobs = await Job.findAll({
    attributes:['id', 'team', 'name', 'country', 'city', 'workType', 'employmentType', 'updatedAt'],
    where: {status: 'Open'},
    include: {
      model: Company, 
      where: {userId: userID},
      attributes:[]
    }
  })
  if (jobs.length < 1) return res.status(200).json({'data': null}) 

  res.status(200).json({'data': jobs})
}


const getJob = async (req, res) => {
  const jobID = req.params.jobID
  const job = await Job.findOne({
    attributes: {exclude: ['createdAt', 'updatedAt', 'companyId', 'status']},
    where: {id: jobID}
  })
  if (!job) return res.status(400).json({'error': true, 'message': 'not a valid job'})
  res.status(200).json({'data': job})
}


const updateJob = async (req, res) => {
  const jobID = req.params.jobID
  const job = req.body
  try {
    await Job.update(job, {where: {id: jobID}})
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const getOverviewJobs = async (req, res) => {
  const userID = req.id
  try {
    const applicantInterviewOfferCount = await sequelize.query(
      `SELECT jobs.id, jobs.name,
      COUNT(DISTINCT CASE WHEN DATE(jc.createdAt) = CURDATE() THEN jc.id END) AS applicantToday, 
      COUNT(DISTINCT CASE WHEN jc.createdAt >= CURDATE() - INTERVAL 7 DAY THEN jc.id END) AS applicantPast7Day,
      COUNT(DISTINCT CASE WHEN sr.interviewDate = CURDATE() THEN sr.jobCandidateId END) AS interviewToday,
      COUNT(DISTINCT CASE WHEN sr.interviewDate > CURDATE() AND sr.interviewDate <= CURDATE() + INTERVAL 7 DAY THEN sr.jobCandidateId END) AS interviewNext7Day,
      COUNT(DISTINCT CASE WHEN sr.stageId = 26 AND sr.createdAt >= CURDATE() - INTERVAL 7 DAY THEN sr.jobCandidateId END) AS offerPast7Day
      FROM jobCandidates jc
      RIGHT JOIN jobs ON jc.jobId = jobs.id 
      LEFT JOIN stageRecords sr ON jc.id = sr.jobCandidateId
      INNER JOIN companies ON companies.id = jobs.companyId
      WHERE jobs.companyId = ? AND jobs.status = 'Open'
      GROUP BY jobs.id, jobs.name WITH ROLLUP`,
      {
        replacements:[userID],
        type: QueryTypes.SELECT
      }
    )
    if (applicantInterviewOfferCount.length < 1) return res.status(200).json({'data': null}) 

    const total = applicantInterviewOfferCount.pop()
    delete total.id
    delete total.name

    const overview = applicantInterviewOfferCount.filter(obj => obj.name !== null)

    res.status(200).json({'data': {"total": total, "jobs": overview} })
    
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


export {getAllJobs, createNewJob , updateJob, getJob, getOpenJobs, getOverviewJobs}