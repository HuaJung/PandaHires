

const companyPage = new URL('/user/company_info', `${window.origin}`)
const dashboardPage = new URL('/user/dashboard', `${window.origin}`)
const applyPage = new URL('career/company_name/job/number/apply', `${window.origin}`)



try {
  const signupBtn = document.querySelector('.btn-signup')
  signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = companyPage
  })
} catch (e) {
  console.error(e)
}

try {
  const submitBtn = document.querySelector('.btn-submit')
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = dashboardPage
  })
} catch(e) {
  console.error(e)
}
try {
  const signinBtn = document.querySelector('.btn-signin')
  signinBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = dashboardPage
  })
} catch(e) {
  console.error(e)
}
try {
  const tempBtn = document.querySelector('#temp-btn')
  tempBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = dashboardPage
  
  })
} catch (e) {
  console.error(e)
}
try {
  const applyBtn = document.querySelector('.small-btn-apply')
  applyBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = applyPage
  
  })
} catch (e) {
  console.error(e)
}
