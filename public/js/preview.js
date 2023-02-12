import { companyIdName } from "./userChecker.js"
const loginPage = new URL('/signin', `${window.origin}`)
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)

const jobData = JSON.parse(localStorage.getItem('job'))
const {name, team, city, country, workType, employmentType, reason, hiringManagerEmail, description, responsibilities, qualifications, preferred} = jobData

renderPreviewJob()
publish()
back()

async function renderPreviewJob() {
  const companyInfo = await companyIdName()
  const title = document.querySelector('title')
  title.textContent = `${name} | ${companyInfo.name}`
  const jobTitle = document.querySelector('.job-title')
  jobTitle.textContent = name
  const location = document.querySelector('.location span')
  location.textContent = `${city}, ${country}`
  const jobDetail = document.querySelector('.job-detail p')
  jobDetail.textContent = description
  
  const jobResponsibility = document.querySelector('.responsibilities p')
  jobResponsibility.textContent = responsibilities
  const jobQualification = document.querySelector('.min-qualifications p')
  jobQualification.textContent = qualifications
  const jobPreferred = document.querySelector('.preferred-qualifications')
  const preferredParentNode = jobPreferred.parentNode
  jobPreferred.querySelector('p').textContent = preferred
  const hr = document.createElement('hr')
  preferredParentNode.insertBefore(hr, jobPreferred)

}

function back() {
  const backBtn = document.querySelector('.back')
  backBtn.addEventListener('click', () => {
    localStorage.removeItem('job')
  })
}

async function publish () {
  const companyInfo = await companyIdName()
  const data = {
    "company_id": companyInfo.id,
    "job": {
      "name": name,
      "team": team,
      "country": country,
      "city": city,
      "work_type": workType,
      "employment_type": employmentType,
      "reason": reason,
      "hiring_manager_email": hiringManagerEmail,
      "description": description,
      "responsibility": responsibilities,
      "qualification": qualifications,
      "preferred": preferred
    }
  }
  const publishBtn = document.querySelector('.publish')
  publishBtn.addEventListener('click', async() => {
    const errorMsg = document.querySelector('.error-msg')
    const errorText = errorMsg.querySelector('span')
    const jobApi = new URL(`/api/${companyInfo.name}/jobs`, `${window.origin}`)
    console.log(jobApi)
    const request = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(data)
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
      errorText.textContent = result.message
      errorMsg.style.opacity = 1
    } else {
      errorText.textContent = result.message
      errorMsg.style.opacity = 1
    }
  })
}
