import express from "express"

const router = express.Router()

router.get('/create_job_posting', (req, res) => {
  res.render('form')
})

router.get('/signin', (req, res) => {
  res.render('auth/signin')
})

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.get('/company_info', (req, res) => {
  res.render('auth/company-form')
})

router.get('/dashboard', (req, res) => {
  res.render('backend/dashboard')
})

router.get('/create_job', (req, res) => {
  res.render('backend/create-job')
})

router.get('/create_candidate', (req, res) => {
  res.render('backend/candidate-form')
})

router.get('/edit_job', (req, res) => {
  res.render('backend/edit-job')
})

router.get('/preview_job', (req, res) => {
  res.render('backend/preview-job')
})


export {router}