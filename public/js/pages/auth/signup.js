import { renderErrorMsg } from "../../components/common/errorMsg.js"
import { validityChecker } from "../../components/validator/inputFleidChecker.js"
const companySignUpPage = new URL('/company_info', `${window.origin}`)
const signUpForm = document.querySelector('form')
const errorGroup = document.querySelector('.error-group')


signupForm()



function signupForm () {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    errorGroup.innerHTML = ''
    const formData = new FormData(signUpForm)
    userSignUp(formData)
  })
}

async function userSignUp(data){
  const authApi = new URL('api/auth', `${window.origin}`)
  const request = {
    'method': 'POST',
    'body': data
  }
  const response = await fetch(authApi, request)
  const result = await response.json()
  if (response.status === 201) {
    window.location = companySignUpPage
  } else if (response.status === 400 ) {
    Object.entries(result.message).forEach(([key, value]) => {
      if (value) {
        signUpForm.querySelector(`.${key}.error`).textContent = value
        signUpForm.querySelector(`input[name=${key}]`).classList.add('submitted')
      }
    })
    validityChecker(signUpForm)

  } else {
    renderErrorMsg({message: 'something went wrong, please try again!'})
  }
}


