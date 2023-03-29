import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { renderNavData, signout } from "../../components/common/navRecruiting.js";


const previewCreatePage = new URL('/recruiting/create_job/preview', `${window.location}`)


jobForm()


if (window.location.pathname.includes('edit_job')) {
  getEditJobContent()
}

async function getEditJobContent() {
  const jobId = window.location.pathname.split('/')[3]
  const jobApi = new URL(`/api/job/${jobId}`, window.origin)
  const response = await fetch(jobApi)
  const result = await response.json()
  if (response.status === 200) {
    renderJobFormContent(result.data)
  } else (
    renderErrorMsg(result)
  )
}

async function renderJobFormContent(jobData) {
  Object.entries(jobData).forEach(([key, value]) => {
    if (key === 'id' || !value) return
    if (key.includes('workType')) {
      document.querySelector(`#${value}`).checked = true
    } else  {
      document.querySelector(`.${key}`).value = value
    }
  })

}

function jobForm() {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const jobData = {}
    for (const [key, value] of formData) {
      jobData[key] = value
    }
    localStorage.setItem('job', JSON.stringify(jobData))
    if(window.location.pathname.includes('edit_job')) {
      location.assign(window.location.href + '/preview')
    } else {
      location.assign(previewCreatePage)
    }
  })
}


