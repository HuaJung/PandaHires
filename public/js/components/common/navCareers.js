import { renderCompany } from "../../pages/careers/companyAbout.js"
import { pageNotFound } from "./404.js"
import { renderErrorMsg } from "./errorMsg.js"
const navLink = document.querySelectorAll('.nav-link')
const companyLink = document.querySelector('.company-link')
const title = document.querySelector('title')



if (window.location.pathname.includes('preview')) {
  getCompany()

} else {
  let companyName = window.location.pathname.split('/')[2]
  navLink[0].href = `/careers/${companyName}/jobs`
  navLink[1].href = `/careers/${companyName}/about`
  companyLink.href = `/careers/${companyName}/about`
  companyName = decodeURI(companyName)

  if (window.location.pathname.split('/')[4]) {
    getSingleJob().then(job => title.textContent = `${companyName} - ${job.name}` )
    
  } else if (window.location.pathname.includes('about')) {
    navLink[1].classList.add('active')
    title.textContent = `${companyName} | About`
  } else {
    navLink[0].classList.add('active')
    title.textContent = `${companyName} | Job Openings`

  }
  getCareersCompany()
}

async function getSingleJob() {
  const jobID = window.location.pathname.split('/')[4]
  const singleJobApi = new URL(`api/career/singlejob?job=${jobID}`, window.origin)
  const response = await fetch(singleJobApi)
  const result = await response.json()
  if (response.status === 200) {
    return result.data
  } else {
    pageNotFound()
  }
}


async function getCompany() {
  const companyApi = new URL('api/company/settings', window.origin)
  const response = await fetch(companyApi)
  const result = await response.json()
  if(response.status === 200) {
    renderCompanyLogo(result.data)
    return result.data
  } else if (response.status === 401) {
    location.assign(loginPage)
  } else if (response.status === 400) {
    renderErrorMsg(result)
  } else {
    renderErrorMsg(result)
  }
}

async function getCareersCompany() {
  const companyName = window.location.pathname.split('/')[2]
  const careerCompanyApi = new URL(`api/career?company=${companyName}`, window.origin)
  const response = await fetch(careerCompanyApi)
  const result = await response.json()
  if (response.status === 200) {
    if (window.location.pathname.includes('about')) {
      renderCompany(result.data)
    } 
    renderCompanyLogo(result.data)
  } else {
    // show 404 not found
    pageNotFound()
  }
}

function renderCompanyLogo(companyData) {
  // companyLink.innerHTML = ''
  let element;
  if (companyData.logo === null) {
    element = document.createElement('h3')
    element.className = 'logo-txt'
    element.textContent = companyData.name
  } else if (companyData.logo.includes('https')) {
    element = document.createElement('img')
    element.className = 'logo-img'
    element.src = companyData.logo
  }
  companyLink.dataset.id = companyData.id
  companyLink.appendChild(element)
}

export {getCompany, getCareersCompany, renderCompanyLogo, getSingleJob}