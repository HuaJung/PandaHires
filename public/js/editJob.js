import { companyIdName } from "./userChecker.js"
const previewBtn = document.querySelector('button[type="sibmit"]')
const jobId = window.location.pathname.split('/').pop()
const previewPage = new URL(`/recruiting/edit_job/${jobId}/preview`, `${window.location}`)


editJobForm()
// renderJobContent()

async function renderJobContent() {

  const company = await companyIdName()
  const jobApi = new URL(`/api/${company.name}/jobs/jobId`, `${window.origin}`)
  const response = await fetch(jobApi)
}

function editJobForm() {


  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const jobData = {}
    for (const [key, value] of formData) {
      jobData[`${key}`] = value
    }
    localStorage.setItem('job', JSON.stringify(jobData))
    location.assign(previewPage)
  })
}


