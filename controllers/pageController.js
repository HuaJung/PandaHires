const homePage = (req, res) => {
  res.render('home/index')
}
const signInPage = (req, res) => {
  res.render('auth/signin', {pageTitle: 'Sign In'})
}
const signUpPage = (req, res) => {
  res.render('auth/signup', {pageTitle: 'Sign Up'})
}
const signUpCompanyPage = (req, res) => {
  res.render('auth/signup-company', {pageTitle: 'Sing Up'})
}

const dashboardPage = (req, res) => {
  res.render('dashboard/dashboard', {pageTitle:'Dashboard'})
}

const settingPage = (req, res) => {
  res.render('settings/settings', {pageTitle: 'Settings'})
}

const createJobPage = (req, res) => {
  res.render('job/job-form-create', {pageTitle: 'Create A Job', currentPage: 'Create A Job Post'})
}

const editJobPage = (req, res) => {
  res.render('job/job-form-create', {pageTitle: 'Edit A Job', currentPage: 'Edit A Job Post'})
}

const previewJobPage = (req, res) => {
  res.render('job/job-create-preview', {pageTitle: 'Preview Job'})
}

const addCandidatePage = (req, res) => {
  res.render('candidate/candidate-form-create', {pageTitle: 'Add A Candidate', currentPage: '+ Candidate'})
}

const editCandidatePage = (req, res) => {
  res.render('job/candidate/candidate-form-edit', {pageTitle: 'Edit A Candidate', currentPage: 'Edit Candidate'})
}

const careerJobOpeningsPage =  (req, res) => {
  res.render('careers/job-openings')
} 

const careersSingleJobPage = (req, res) => {
  res.render('careers/job-post')
} 

const careersAboutPage = (req, res) => {
  res.render('careers/company-about')
}


export {homePage, signInPage, signUpPage, signUpCompanyPage, addCandidatePage, createJobPage, editCandidatePage, dashboardPage, settingPage, previewJobPage, careersSingleJobPage, careersAboutPage, careerJobOpeningsPage,editJobPage}