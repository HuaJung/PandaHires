import { renderErrorMsg } from "../../components/common/errorMsg.js"
import { getCompany, getCareersCompany, renderCompanyLogo } from "../../components/common/navCareers.js"
const loginPage = new URL('/signin', `${window.origin}`)
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const jobData = JSON.parse(localStorage.getItem('job')) 
const postBtn = document.querySelector('.btn-post')
const errorGroup = document.querySelector('.error-group')


renderPreviewJob()
back()


if (window.location.pathname.includes('create_job')) {
  postBtn.querySelector('span').textContent = 'Publish'
  publish()
} else { 
  postBtn.querySelector('span').textContent = 'Update'
  update()
}



function renderPreviewJob() {
  Object.entries(jobData).forEach(([key, value])=> {
    if (key.includes('reason') || (key.includes('hiringManagerEmail')) || !value) return
    if (key.includes('preferred') && value) {
      const preferredSection = document.querySelectorAll('.job')[4]
      const preferredParentNode = preferredSection.parentNode
      const hr = document.createElement('hr')
      preferredParentNode.insertBefore(hr, preferredSection)
      const preferredEle = [
        {
          element: 'h2',
          className: null,
          content: 'Preferred Qualification'
        },
        {
          element: 'p',
          className: 'preferred',
          content: value
        }
      ]
      preferredEle.forEach((ele) => {
        let element = document.createElement(ele.element)
        element.className = ele.className
        element.textContent = ele.content
        preferredSection.appendChild(element)
      }) 
    } else {
      document.querySelector(`.${key}`).textContent = value
    }

  })
}

function back() {
  const backBtn = document.querySelector('.btn-back')
  backBtn.addEventListener('click', () => {
    localStorage.removeItem('job')
  })
}

async function publish () {
  postBtn.addEventListener('click', async(e) => {
    errorGroup.innerHTML = ''
    const jobApi = new URL('/api/job/create', `${window.origin}`)
    const company = await getCompany()
    jobData['companyId'] = company.id

    const request = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(jobData)
    }

    const response = await fetch(jobApi, request)
    const result = await response.json()
    if (response.status === 201) {
      localStorage.removeItem('job')
      location.assign(dashboardPage)
    } else if (response.status === 401) {
      localStorage.removeItem('job')
      location.assign(loginPage)
    } else if (response.status === 400) {
      renderErrorMsg(result)
    } else {
      renderErrorMsg(result)
    }
  })
}


async function update () {
  postBtn.addEventListener('click', async() => {
    errorGroup.innerHTML = ''
    const company = await getCompany()
    const jobId = window.location.pathname.split('/')[3]
    const jobApi = new URL(`/api/job/${jobId}`, `${window.origin}`)

    jobData['companyId'] = company.id
    const request = {
      'method': 'PATCH',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(jobData)
    }

    const response = await fetch(jobApi, request)
    const result = await response.json()
    if (response.status === 200) {
      localStorage.removeItem('job')
      location.assign(dashboardPage)
    } else if (response.status === 401) {
      localStorage.removeItem('job')
      location.assign(loginPage)
    } else if (response.status === 400) {
      renderErrorMsg(result)
    } else {
      renderErrorMsg(result)
    }
  })
}

