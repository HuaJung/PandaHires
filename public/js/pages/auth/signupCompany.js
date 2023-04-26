import { signInChecker } from '../../components/validator/userChecker.js'
import { validityChecker } from "../../components/validator/inputFleidChecker.js"
import { renderErrorMsg } from '../../components/common/errorMsg.js'
const companySignUpForm = document.querySelector('form')
const dashboardPage = new URL('/recruiting/dashboard', `${window.origin}`)
const nameError = document.querySelector('.name.error')
const countryError = document.querySelector('.country.error')
const addError = document.querySelector('.address.error')
const telError = document.querySelector('.tel.error')
const errorGroup = document.querySelector('.error-group')


signInChecker()
companySignupForm()

function companySignupForm() {
  companySignUpForm.addEventListener('submit', async(e) => {
    e.preventDefault()
    // nameError.textContent = ''
    // countryError.textContent = ''
    // addError.textContent = ''
    // telError.textContent = ''
    errorGroup.innerHTML = ''

    const formData = new FormData(companySignUpForm)
    // const companyName = form.name
    // const companyCountry = form.country
    // const companyAddress = form.address
    // const companyTel = form.tel
    // emptyFieldChecker(companyName)
    // emptyFieldChecker(companyCountry)
    // emptyFieldChecker(companyAddress)
    // emptyFieldChecker(companyTel)
    // if (!companyName.value || !companyCountry.value || !companyAddress.value || !companyTel.value) return
    // const companyData = {
    //   'name': companyName.value,
    //   'country': companyCountry.value,
    //   'address': companyAddress.value,
    //   'tel': companyTel.value
    // }
    companySignUp(formData)
  })
}

async function companySignUp(data) {
  const companyApi = new URL('api/company', `${window.origin}`)
  const request = {
    'method': 'POST',
    'body': data
  }
  const response = await fetch(companyApi, request)
  const result = await response.json()
  if (response.status === 201) {
    window.location = dashboardPage
  } else if (response.status === 400) {
    Object.entries(result.message).forEach(([key, value]) => {
      if (value) {
        companySignUpForm.querySelector(`.${key}.error`).textContent = value
        signUpForm.querySelector(`input[name=${key}]`).classList.add('submitted')
      }
    })
    validityChecker(companySignUpForm)
    // nameError.textContent = result.message.name
    // countryError.textContent = result.message.country
    // addError.textContent = result.message.address
    // telError.textContent = result.message.tel
  } else {
    renderErrorMsg({message: 'something went wrong, please try again!'})
  }
}