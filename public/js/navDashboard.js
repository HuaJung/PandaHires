import { signInChecker, fetchUserId } from "./userChecker.js"


const homePage = new URL('/', `${window.origin}`)
const authApi = new URL('api/auth', `${location.origin}`)


try {
  renderInitial()
} catch(e) {
  console.error(e)
}
signInChecker()
signout()

async function renderInitial() {
  const userInfo = await fetchUserId()
  const profileToggle = document.querySelector('.profile-toggle')
  profileToggle.textContent = userInfo.name[0]
}

function signout () {
  const signoutBtn = document.querySelector('.small-btn-signout')
  signoutBtn.addEventListener('click', async() => {
    const response = await fetch(authApi, {'method': 'DELETE'})
    if (response.status === 204) location.assign(homePage)
  })
}