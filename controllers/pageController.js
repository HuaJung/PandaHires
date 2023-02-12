const homePage = (req, res) => {
  res.render('index')
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


// const dashboardPage = (req, res) => {
//   res.render('backend/dashboard', {pageTitle:'My Dashboard'})
// }
const createJobPage = (req, res) => {
  res.render('backend/job-form', {pageTitle: 'Create A Job', currentPage: '+ Job'})
}
const createCandidatePage = (req, res) => {
  res.render('backend/candidate-form', {pageTitle: 'Add A Candidate', currentPage: '+ Candidate'})
}
// const editJogPage = (req, res) => {
//   res.render('backend/edit-job', {pageTitle: 'Edit A Job', currentPage: 'Edit Job'})
// }
const editCandidatePage = (req, res) => {
  res.render('backend/edit-candidate', {pageTitle: 'Edit A Candidate', currentPage: 'Edit Candidate'})
}
// const previewJobPage = (req, res) => {
//   res.render('backend/preview-job', {jobName: 'ABC', companyName: 'DEF'})
// }


export {homePage, signInPage, signUpPage, signUpCompanyPage, createCandidatePage, createJobPage, editCandidatePage}