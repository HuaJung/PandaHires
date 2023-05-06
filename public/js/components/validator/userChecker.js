const homePage = new URL('/', `${window.origin}`)
const userApi = new URL('api/user', `${window.origin}`)
const loginPage = new URL('/signin', `${window.origin}`)


async function signInChecker ()  {
  const response = await fetch(userApi)
  const result = await response.json()
  if (response.status === 400) {
    window.location = homePage;
  } else if (response.status === 401 || response.status === 403) {
    location.replace(loginPage)
  } else {
    return result.data
  } 
}


export {signInChecker, homePage}
