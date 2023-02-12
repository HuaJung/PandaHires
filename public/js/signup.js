const companySignUpPage = new URL('/company_info', `${window.origin}`)
const form = document.querySelector('form')
const emailError = document.querySelector('.email.error')
const pwdError = document.querySelector('.password.error')
const positionError = document.querySelector('.position.error')
const nameError = document.querySelector('.name.error')


signupForm()


function signupForm () {
  const signupBtn = document.querySelector('.large-btn-signup')
  signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    // reset error from server-side
    nameError.textContent = ''
    positionError.textContent = ''
    emailError.textContent = ''
    pwdError.textContent = ''

    const formData = new FormData(form)
    const userData = {}
    for (const [key, value] of formData) {
      const input = document.querySelector(`input[name=${key}]`)
      if (!value) {
        input.setCustomValidity(`Please fill up your ${key}`);
        return input.reportValidity()
      } else {
        input.setCustomValidity('')
        userData[`${key}`] = value
      }
    }
    // const userName = document.querySelector('.user-name')
    // const userPosition = document.querySelector('.user-position')
    // const userEmail = document.querySelector('.user-email')
    // const userPassword = document.querySelector('.user-password')
    // const formData = new FormData()
    // emptyFieldChecker(userName, 'your name')
    // emptyFieldChecker(userPosition, 'your position')
    // emptyFieldChecker(userEmail, 'your email')
    // emptyFieldChecker(userPassword, 'your password')
    // if (!userName.value || !userPosition.value || !userEmail.value || !userPassword.value) return
    // const userData = {
    //   'user': {
    //     'name': userName.value,
    //     'position': userPosition.value,
    //     'email': userEmail.value,
    //     'password': userPassword.value
    //   }
    // }  
    userSignUp(userData)
  })
}

async function userSignUp(data){
  const errorMsg = document.querySelector('.error-msg')
  const errorText = errorMsg.querySelector('span')
  const authApi = new URL('api/auth', `${window.origin}`)
  const request = {
    'method': 'POST',
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(data)
  }
  const response = await fetch(authApi, request)
  if (response.status === 201) {
    window.location = companySignUpPage
  } else if (response.status === 400 ) {
    nameError.textContent = result.message.name
    positionError.textContent = result.message.position
    emailError.textContent = result.message.email
    pwdError.textContent = result.message.password
  } else if (response.status === 409) {
    errorText.textContent += 'account already exits'
    errorMsg.style.opacity = 1
    return
  } else {
    errorText.textContent += 'something went wrong, please try again!'
    errorMsg.style.opacity = 1
    return
  }
}

function renderCompanyForm() {
  const backgroundImg = document.querySelector('.background-pic img')
  backgroundImg.src='images/company.jpg'
  const formTitle = document.querySelector('.header-text h1')
  formTitle.textContent = 'Company Info'
  const gridForm = document.querySelector('.grid-form')
  gridForm.innerHTML=''

  const label = document.createElement('label')
  const companyNameLabel = label.cloneNode()
  companyNameLabel.textContent = 'Company Name'
  const countryLabel = label.cloneNode()
  countryLabel.textContent = 'Country'
  const addressLabel = label.cloneNode()
  addressLabel.textContent = 'Address'
  const telLabel = label.cloneNode()

  const input = document.createElement('input')
  input.type = 'text'
  const companyNameInput = input.cloneNode(true)
  companyNameInput.placeholder='Company Name'
  companyNameInput.className = 'company-name'
  const countryInput = input.cloneNode(true)
  countryInput.placeholder = 'Country'
  countryInput.className = 'company-country'
  const addressInput = input.cloneNode(true)
  addressInput.placeholder='Address'
  addressInput.className='company-address'
  const telInput = input.cloneNode()
  telInput.type = 'tel'
  telInput.placeholder = 'Telephone no.'
  telInput.className = 'company-tel'

  gridForm.append(companyNameInput, countryInput, addressInput, telInput)

}


