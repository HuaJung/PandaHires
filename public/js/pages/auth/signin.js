import { renderErrorMsg } from '../../components/common/errorMsg.js'
import { emptyFieldChecker } from '../../components/validator/emptyFieldChecker.js'


const emailError = document.querySelector('.email.error')
const pwdError = document.querySelector('.password.error')
const errorGroup = document.querySelector('.error-group')

signinForm()

function signinForm () {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    // reset error from server-side
    emailError.textContent = ''
    pwdError.textContent = ''
    errorGroup.innerHTML = ''
    
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
  const authApi = new URL('api/auth', `${window.origin}`)
  const request = {
    'method': 'PUT',
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(data)
  }
  const response = await fetch(authApi, request)
  const result = await response.json()

  if (response.status === 200) {
    const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
    location.assign(dashboardPage)
  } else if (response.status === 400 ) {
    emailError.textContent = result.message.email
    pwdError.textContent = result.message.password
  } else if (response.status === 401 || response.status === 403) {
    renderErrorMsg(result)
  } else {
    renderErrorMsg(result)
  }
}