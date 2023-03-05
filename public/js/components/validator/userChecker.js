const homePage = new URL('/', `${window.origin}`)
const authApi = new URL('api/auth', `${window.origin}`)
const loginPage = new URL('/signin', `${window.origin}`)


async function signInChecker ()  {
  const response = await fetch(authApi)
  const result = await response.json()

  if (result.data === null) {
    window.location = homePage;
  } else if (response.status === 401) {
    location.assign(loginPage)
  } else {
    return result.data
  } 
}


export {signInChecker, homePage, authApi}
