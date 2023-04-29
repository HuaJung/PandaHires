import { renderErrorMsg } from '../../components/common/errorMsg.js'

const signInForm = document.querySelector('form')
const errorGroup = document.querySelector('.error-group')


signinForm()


function signinForm () {
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // reset error from server-side
    errorGroup.innerHTML = ''

    const formData = new FormData(signInForm) 
    userSignIn(formData)
  })
}

async function userSignIn(data){
  const authApi = new URL('api/auth', `${window.origin}`)
  const request = {
    'method': 'PUT',
    'body': data
  }
  const response = await fetch(authApi, request)
  const result = await response.json()

  if (response.status === 200) {
    const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
    location.assign(dashboardPage)
  } else if (response.status === 400 ) {
    renderErrorMsg(result)
  } else if (response.status === 401 || response.status === 403) {
    renderErrorMsg(result)
  } else {
    renderErrorMsg(result)
  }
}