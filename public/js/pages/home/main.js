const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const authApi = new URL('/api/auth', `${window.origin}`)
const loginPage = new URL('/signin', `${window.origin}`)



signInChecker()

function signInChecker ()  {
  const signinBtn = document.querySelector('.signin')
  signinBtn.addEventListener('click', async () => {
    const response =  await fetch(authApi)
    const result = await response.json()
    if (response.status === 200 ) {
      window.location = dashboardPage
    } else {
      location.assign(loginPage)
    }
  })
}
