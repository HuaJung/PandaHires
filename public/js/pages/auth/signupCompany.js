import { signInChecker } from '../../components/validator/userChecker.js'
import { emptyFieldChecker } from '../../components/validator/emptyFieldChecker.js'
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const nameError = document.querySelector('.name.error')
const countryError = document.querySelector('.country.error')
const addError = document.querySelector('.address.error')
const telError = document.querySelector('.tel.error')



signInChecker()
companyForm()

function companyForm() {
  const form = document.querySelector('form')
  form.addEventListener('submit', async(e) => {
    e.preventDefault()
    nameError.textContent = ''
    countryError.textContent = ''
    addError.textContent = ''
    telError.textContent = ''

    const companyName = form.name
    const companyCountry = form.country
    const companyAddress = form.address
    const companyTel = form.tel
    emptyFieldChecker(companyName)
    emptyFieldChecker(companyCountry)
    emptyFieldChecker(companyAddress)
    emptyFieldChecker(companyTel)
    if (!companyName.value || !companyCountry.value || !companyAddress.value || !companyTel.value) return
    const companyData = {
      'name': companyName.value,
      'country': companyCountry.value,
      'address': companyAddress.value,
      'tel': companyTel.value
    }
    companySignUp(companyData)
  })
}

async function companySignUp(data) {
  const errorMsg = document.querySelector('.error-msg')
  const errorText = errorMsg.querySelector('span')
  const companyApi = new URL('api/company', `${window.origin}`)
  const request = {
    'method': 'POST',
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(data)
  }
  const response = await fetch(companyApi, request)
  const result = await response.json()
  if (response.status === 201) {
    window.location = dashboardPage
  } else if (response.status === 401) {
    errorText.textContent = 'please login first'
    errorMsg.style.opacity = 1
  } else if (response.status === 400) {
    nameError.textContent = result.message.name
    countryError.textContent = result.message.country
    addError.textContent = result.message.address
    telError.textContent = result.message.tel
  } else {
    errorText.textContent = 'something went wrong, please try again!'
    errorMsg.style.display = 'flex'
  }
}