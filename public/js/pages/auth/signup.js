import { renderErrorMsg } from "../../components/common/errorMsg.js"
import { validityChecker } from "../../components/validator/inputFleidChecker.js"
const companySignUpPage = new URL('/company_info', `${window.origin}`)
const signUpForm = document.querySelector('form')
const emailError = document.querySelector('.email.error')
const passwordError = document.querySelector('.password.error')
const positionError = document.querySelector('.position.error')
const nameError = document.querySelector('.name.error')
const errorGroup = document.querySelector('.error-group')


signupForm()



function signupForm () {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // reset error from server-side
    // nameError.textContent = ''
    // positionError.textContent = ''
    // emailError.textContent = ''
    // passwordError.textContent = ''
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
    // signUpForm.querySelectorAll('input').forEach((input) => {
    //   input.addEventListener('input', (e) => {
    //     if (e.target.validity.valid) {
    //       signUpForm.classList.remove('submitted')
    //     }
    //   })
    // })
    // nameError.textContent = result.message.name
    // positionError.textContent = result.message.position
    // emailError.textContent = result.message.email
    // passwordError.textContent = result.message.password

  } else {
    renderErrorMsg({message: 'something went wrong, please try again!'})
  }
}


