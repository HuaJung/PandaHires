import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { renderNavData, signout, dashboardPage, companyInfo } from "../../components/common/navRecruiting.js";


const jobSelect = document.querySelector('select[name=jobId]')
const inputFile = document.querySelector('input[type=file]')
const form = document.querySelector('form')
const errorGroup = document.querySelector('.error-group')


getAllJobs()
addCandidate()

inputFile.addEventListener('change', updateFileDisplay)


async function getAllJobs() {
  const allJobsApi = new URL('/api/job/openings', window.origin)
  const response = await fetch(allJobsApi)
  const result = await response.json()
  if (response.status === 200) {
    renderAllJobs(result.data)
  } else {
    renderErrorMsg(result)
  }
}

function renderAllJobs(jobData) {
  const option = document.createElement('option')
  if (jobData === null) {
    option.label = 'No Open Jobs Yet'
    option.disabled = true
    jobSelect.appendChild(option)
  } else {
    jobData.forEach(job => {
      const optionClone = option.cloneNode()
      optionClone.textContent = job.name
      optionClone.value = job.id
      jobSelect.appendChild(optionClone)
    });
  }
}

function updateFileDisplay() {
  // empty the previous image info
  const preview = document.querySelector('.preview')
  preview.innerHTML = ""
  const curFile = inputFile.files[0];
  if (curFile.length === 0) {   
    preview.textContent = 'No files currently selected for upload';
  } else {
    preview.textContent = curFile.name
  };
};

function addCandidate() {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorGroup.innerHTML = ''

    const jobId = document.querySelector('select[name=jobId]').value
    const candidateApi = new URL(`/api/candidate/${jobId}`, window.origin)
    const submitBtn = document.querySelector('.btn-submit')
    submitBtn.disabled= true
    const submitBtnTxt = submitBtn.querySelector('span')
    submitBtnTxt.textContent = 'Creating...'

    const formData = new FormData(form)
    const request = {
      'method': 'POST',
      'body': formData
    }
    const response = await fetch(candidateApi, request)
    const result = await response.json()
    if (response.status === 201) {
      location.assign(dashboardPage)
    } else if(response.status === 400) {
      renderErrorMsg(result)
    } else {
      renderErrorMsg(result)
    }
    submitBtn.disabled= false
    submitBtnTxt.textContent = 'Create'
  })
}

