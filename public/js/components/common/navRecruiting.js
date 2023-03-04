import { signInChecker } from "../validator/userChecker.js"
import { companyInfo } from "./companyInfo.js"
const dashboardPage = new URL('recruiting/dashboard', `${window.origin}`)
// const authApi = new URL('api/auth', `${location.origin}`)


signInChecker()
renderNavData()
signout() 


async function renderNavData() {
  const user = await signInChecker()
  const company = await companyInfo()
  const profileToggle = document.querySelector('.profile-toggle')
  const careersPageLink = document.querySelector('.careers')
  const head = document.querySelector('head')
  const settingLink = document.querySelector('.settings')
  const dashboardLink = document.querySelector('.dashboard')
  const addJob = document.querySelector('.add-job')
  const addCandidate = document.querySelector('.add-candidate')

  profileToggle.textContent = user.name[0]  // first letter of username
  careersPageLink.href = `/careers/${company.name}/jobs`

  if (head.textContent.includes('Settings')) {
    settingLink.querySelector('.bi-gear').style.fill = 'var(--secondary-text-color)'
  } else if (head.textContent.includes('Dashboard')) {
    dashboardLink.parentNode.style.borderBottom = '1px solid var(--secondary-text-color)'
    dashboardLink.style.color = 'var(--secondary-text-color)'
  } else if (head.textContent.includes('Job')) {
    addJob.style.backgroundColor='var(--primary-button-backgrond)'
    addJob.style.color = 'var(--primary-button-color)'
  } else if (head.textContent.includes('Candidate')) {
    addCandidate.style.backgroundColor='var(--primary-button-backgrond)'
    addCandidate.style.color = 'var(--primary-button-color)'
  }
}

function signout () {
  const signoutBtn = document.querySelector('.small-btn-signout')
  signoutBtn.addEventListener('click', async() => {
    const response = await fetch(authApi, {'method': 'DELETE'})
    if (response.status === 204) location.assign(homePage)
  })
}

export {renderNavData, signout, dashboardPage, companyInfo}