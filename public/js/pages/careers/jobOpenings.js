import { getCareersCompany, renderCompanyLogo } from "../../components/common/navCareers.js";
const conatiner = document.querySelector('.container')
const companyName = window.location.pathname.split('/')[2]


getOpenings()

async function getOpenings(){
  const jobApi = new URL(`api/career/alljobs?company=${companyName}`, window.origin)
  const response = await fetch(jobApi)
  const result = await response.json()
  if (result.data === null) {
    conatiner.innerHTML = `<h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg> No Job Openings</h3>`

  } else if (result.data) {
    renderOpenings(result.data)
  }

}

function renderOpenings(jobData) {
  const listGroup = document.querySelector('.grid-list-group')

  jobData.forEach(({team, jobs}) => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    const teamGroup = div.cloneNode()
    teamGroup.className = 'team-group'

    jobs.forEach((job) => {
      const teamName = document.createElement('h3')
      teamName.className = 'team'
      teamName.textContent = team

      const jobLink = document.createElement('a')
      jobLink.className = 'grid-job-link'
      jobLink.href = `/careers/${companyName}/jobs/${job.id}`
      
      const jobName = document.createElement('h4')
      jobName.className = 'name'
      jobName.textContent = job.name

      const updatedAt = document.createElement('small')
      updatedAt.className = 'updatedAt'
      updatedAt.textContent = job.updatedAt.split(' ')[0]

      const jobInfo = div.cloneNode()
      jobInfo.className = 'info'

      const workType = span.cloneNode()
      workType.textContent = job.workType

      const jobCity = span.cloneNode()
      jobCity.textContent = job.city
      
      const jobCountry = span.cloneNode()
      jobCountry.textContent = job.country

      const empolymentType = span.cloneNode()
      empolymentType.textContent = job.employmentType

      jobInfo.append(workType, ' - ', jobCity, ', ', jobCountry, ' | ', empolymentType)
      jobLink.append(jobName, updatedAt, jobInfo)
      teamGroup.append(teamName, jobLink)
    })
    listGroup.appendChild(teamGroup)

  })

}