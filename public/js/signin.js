import { emptyFieldChecker } from "./util.js"
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const emailError = document.querySelector('.email.error')
const pwdError = document.querySelector('.password.error')


signinForm()

function signinForm () {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    // reset error from server-side
    emailError.textContent = ''
    pwdError.textContent = ''

    // get input for frontend validation
    const userEmail = form.email
    const userPassword = form.password
    emptyFieldChecker(userEmail)
    emptyFieldChecker(userPassword)

    if (!userEmail.value || !userPassword.value) return
    const userData = {
      'email': userEmail.value,
      'password': userPassword.value
    }  
    userSignIn(userData)
  })
}

async function userSignIn(data){
  const errorMsg = document.querySelector('.error-msg')
  const errorText = errorMsg.querySelector('span')
  const authApi = new URL('api/auth', `${location.origin}`)
  const request = {
    'method': 'PUT',
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(data)
  }
  const response = await fetch(authApi, request)
  const result = await response.json()
  if (response.status === 200) {
    location.assign(dashboardPage)
  } else if (response.status === 400 ) {
    emailError.textContent = result.message.email
    pwdError.textContent = result.message.password
  } else if (response.status === 401) {
    errorText.textContent += result.message
    errorMsg.style.opacity = 1
    return
  } else {
    errorText.textContent = 'something went wrong, please try again!'
    errorMsg.style.opacity = 1
    return
  }
}