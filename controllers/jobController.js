import { where } from "sequelize";
import { Users, Companies, Jobs, JobCandidate, Candidates } from "../models/db.js";

const handleNewJob = async (req, res) => {

  const companyId = req.body.company_id
  const job = req.body.job
  try {
    const newJob = await Jobs.create({
      company_id: companyId,
      name: job.name,
      team: job.team,
      country: job.country,
      city: job.city,
      work_type: job.work_type,
      employment_type: job.employment_type,
      reason: job.reason,
      hiring_manager_email: job.hiring_manager_email,
      description: job.description,
      responsibility: job.responsibility,
      qualification: job.qualification,
      preferred: job.preferred
    })
    res.status(201).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const handlePreviewJob = async (req, res) => {
  const userId = req.id
  const foundCompany = await Companies.findOne({where: {user_id: userId}})
  if (!foundCompany) return res.status(400).json({'data': null})
  const companyName = foundCompany.name
  res.render('backend/preview-job', {companyName: companyName})
}

const handleEditPreviewJob = async (req, res) => {
  const userId = req.id
  const foundCompany = await Companies.findOne({where: {user_id: userId}})
  if (!foundCompany) return res.status(400).json({'data': null})
  const companyName = foundCompany.name
  res.render('backend/preview-job-edit', {companyName: companyName})
}

const handleAllJobs = async (req, res) => {
  const userId = req.id
  const company = await Companies.findOne({where: {user_id: userId}, attributes:['id', 'name']})
  const allJobs = await Jobs.findAll({
    where: {company_id: company.id}, 
    attributes:['id', 'team', 'name', 'country', 'city', 'work_type']})
  // if (!allJobs) return res.status(200).json({'data': null})
  // allJobs.forEach(job => {
  //   const jobs = {
  //     'id': job.id,
  //     'team': job.team,
  //     'name': job.name,
  //     'country': job.country,
  //     'city': job.city,
  //     'work_type': job.work_type
  //   }
  // });
  res.render('backend/dashboard', {pageTitle:'My Dashboard', jobs: allJobs, companyName: company.name})
}

const handleCloseJob = async (req, res) => {
  const jobId = req.params.jobId
  try{
    await Jobs.destroy({where: {id: jobId}})
    res.status(200).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

const careersAllJobs = async(req, res) => {
  const userId = req.id
  const company = await Companies.findOne({where: {user_id: userId}, attributes:['id', 'name']})
  const allJobs = await Jobs.findAll({
    where: {company_id: company.id}, 
    attributes:['id', 'team', 'name', 'country', 'city', 'work_type']})
    res.render('backend/frontend/job-openings', {curragePage:'All jobs', jobs: allJobs, companyName: company.name})
}
const handleOneJob = async (req, res) => {
  const jobId = req.params.jobId
  const job = await Jobs.findOne({where: {id: jobId}})
  const companyName = await Companies.findOne({where: {id: job.company_id}, attributes: ['name']})
  res.render('backend/edit-job', {pageTitle: 'Edit A Job', currentPage: 'Edit Job', job: job, companyName: companyName})
}

const handleJobUpdate = async (req, res) => {
  const jobId = req.params.jobId
  const job = req.body.job
  const companyId = req.body.company_id
  try {
    const updateJob = await Jobs.update({
      company_id: job.companyId,
      name: job.name,
      team: job.team,
      country: job.country,
      city: job.city,
      work_type: job.work_type,
      employment_type: job.employment_type,
      reason: job.reason,
      hiring_manager_email: job.hiring_manager_email,
      description: job.description,
      responsibility: job.responsibility,
      qualification: job.qualification,
      preferred: job.preferred
    }, {where: {id: jobId}})
    res.status(200).json({'ok': true})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


export {handlePreviewJob, handleNewJob, handleAllJobs, handleCloseJob, careersAllJobs, handleOneJob, handleEditPreviewJob, handleJobUpdate}