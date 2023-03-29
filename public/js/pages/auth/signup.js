import { renderErrorMsg } from "../../components/common/errorMsg.js"

const companySignUpPage = new URL('/company_info', `${window.origin}`)
const form = document.querySelector('form')
const emailError = document.querySelector('.email.error')
const pwdError = document.querySelector('.password.error')
const positionError = document.querySelector('.position.error')
const nameError = document.querySelector('.name.error')
const errorGroup = document.querySelector('.error-group')


signupForm()


function signupForm () {
  const signupBtn = document.querySelector('.large-btn-signup')
  signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    // reset error from server-side
    nameError.textContent = ''
    positionError.textContent = ''
    emailError.textContent = ''
    pwdError.textContent = ''
    errorGroup.innerHTML = ''

    const formData = new FormData(form)
    const userData = {}
    for (const [key, value] of formData) {
      const input = document.querySelector(`input[name=${key}]`)
      if (!value) {
        input.setCustomValidity(`Please fill up your ${key}`);
        return input.reportValidity()
      } else {
        input.setCustomValidity('')
        userData[`${key}`] = value
      }
    } 
    userSignUp(userData)
  })
}

async function userSignUp(data){
  const authApi = new URL('api/auth', `${window.origin}`)
  const request = {
    'method': 'POST',
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(data)
  }
  const response = await fetch(authApi, request)
  if (response.status === 201) {
    window.location = companySignUpPage
  } else if (response.status === 400 ) {
    nameError.textContent = result.message.name
    positionError.textContent = result.message.position
    emailError.textContent = result.message.email
    pwdError.textContent = result.message.password
  } else if (response.status === 409) {
    renderErrorMsg({message: 'account already exits'})
    return
  } else {
    renderErrorMsg({message: 'something went wrong, please try again!'})
  }
}



