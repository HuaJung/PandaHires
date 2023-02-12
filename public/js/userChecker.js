const homePage = new URL('/', `${window.origin}`)
const compayPage = new URL('/company_info', `${window.origin}`)
const authApi = new URL('api/auth', `${location.origin}`)
const userApi = new URL('api/auth/user', `${location.origin}`)
const companyApi = new URL('api/auth/company', `${location.origin}`)

async function ajax(url) {
  return fetch(url).then(response => response.json())
}

async function signInChecker ()  {
  const response =  await fetch(authApi)
  const result = await ajax(authApi)
  if (result.data === null) {window.location = homePage}
  else return result.data.user.id
}

async function fetchUserId ()  {
  const response = await fetch(userApi)
  const result = await response.json()
  if (result.data === null) {window.location = homePage}
  else return result.data.user
}

async function companyIdName() {
  const result = await ajax(companyApi)
  if (result.data === null) window.location = compayPage
  return result.data.company
}


export {signInChecker, fetchUserId, companyIdName}
