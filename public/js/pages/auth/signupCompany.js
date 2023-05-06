import { validityChecker } from "../../components/validator/inputFleidChecker.js"
import { renderErrorMsg } from '../../components/common/errorMsg.js'
const companySignUpForm = document.querySelector('form')
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const errorGroup = document.querySelector('.error-group')


companySignupForm()

function companySignupForm() {
  companySignUpForm.addEventListener('submit', async(e) => {
    e.preventDefault()
    errorGroup.innerHTML = ''

    const formData = new FormData(companySignUpForm)
    companySignUp(formData)
  })
}

async function companySignUp(data) {
  const companyApi = new URL('api/company', `${window.origin}`)
  const request = {
    'method': 'POST',
    'body': data
  }
  const response = await fetch(companyApi, request)
  const result = await response.json()
  if (response.status === 201) {
    window.location = dashboardPage
  } else if (response.status === 400) {
    Object.entries(result.message).forEach(([key, value]) => {
      if (value) {
        companySignUpForm.querySelector(`.${key}.error`).textContent = value
        signUpForm.querySelector(`input[name=${key}]`).classList.add('submitted')
      }
    })
    validityChecker(companySignUpForm)

  } else {
    renderErrorMsg({message: 'something went wrong, please try again!'})
  }
}