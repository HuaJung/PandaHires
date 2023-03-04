import { renderPreviewJob, back, companyInfo } from "../public/js/pages/job/previewJob.js"
const loginPage = new URL('/signin', `${window.origin}`)
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const jobData = JSON.parse(localStorage.getItem('job')) 


renderPreviewJob()
update()
back()





