import express from "express"

const router = express.Router()

router.get('/about', (req, res) => {
  res.render('frontend/about-company')
})

router.get('/all_jobs', (req, res) => {
  res.render('frontend/job-list')
})

router.get('/team', (req, res) => {
  res.render('frontend/team')
})

router.get('/job/number', (req, res)=> {
  res.render('frontend/job-post')
})

router.get('/job/number/apply', (req, res) => {
  res.render('frontend/apply')
})

export {router}