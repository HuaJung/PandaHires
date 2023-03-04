import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { renderNavData, signout } from "../../components/common/navRecruiting.js";
const userApi = new URL('api/user', window.origin)
const companyApi = new URL('api/company/settings', window.origin)
const companyForm = document.querySelector('form')
const successMsg = document.querySelector('.success-msg')
const editCompanyBtn = document.querySelector('.company .bi-pencil-square')
const companyModal = document.querySelector('.modal-dialog')
const closeModal = document.querySelector('.close-btn')


getUser()
updateUser()
showCompanyForm()
updateFileDisplay()
updateCompany()



function showCompanyForm() {
  editCompanyBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    companyModal.showModal()
    getCompany()
  })
  closeModal.addEventListener('click', () => {
    companyModal.close()
})

}

async function getCompany() {
  const response = await fetch(companyApi)
  const result = await response.json()
  if (response.status === 200) {
    delete result.data.id
    delete result.data.logo
    delete result.data.image
    const companyData = result.data 
    renderCompanyData(companyData)
  } else if (response.status === 401) {
    location.assign(loginPage)
  } else {
    renderErrorMsg(result)
  }
}

async function getUser() {
  const response = await fetch(userApi)
  const result = await response.json()
  if (response.status === 200) {
    renderUserData(result.data)
  } else if (response.status === 401) {
    location.assign(loginPage)
  } else {
    renderErrorMsg(result)
  }

}
function renderCompanyData(companyData) {
  Object.entries(companyData).forEach(([key, value])=> {
    if (value) {
      if (key === 'imageOriginName' || key === 'logoOriginName') {
        const preview = companyForm.querySelector(`#${key}`);   
        preview.textContent = value
      } else if (key.includes('paragraph')){
        companyForm.querySelector(`textarea[name=${key}]`).textContent = value
      } else {
        companyForm.querySelector(`input[name=${key}]`).value = value
      }
    }
  })
}

function renderUserData (userData) {
  Object.entries(userData).forEach(([key, value])=> {
    document.querySelector(`.user.${key}`).textContent = value
  })
}

function updateUser() {
  const userForm = document.querySelector('.grid-user-form')
  userForm.addEventListener('click', async(e) => {
    e.stopPropagation()
    if (e.target.tagName === 'svg' || e.target.tagName === 'path') {     
      if (e.target.closest('svg').className.baseVal === 'bi bi-check-circle') {    
        const currentUpdateBtn = e.target.closest('svg')
        const currentEle = e.target.closest('.user-input').firstElementChild
        const updatedData = {}
        updatedData[currentEle.className.split(' ')[1]] = currentEle.textContent
        const request = {
          'method': 'PATCH',
          'header': {'Content-Type': 'application/json'},
          'body':JSON.stringify(updatedData)
        }
        const response = await fetch(userApi, request)
        const result = await response.json()
        if (response.status === 200) {
          currentUpdateBtn.style.fill = 'var(--active-button-color)'
        } else if (response.status === 401) {
          location.assign(loginPage)
        } else {
          renderErrorMsg(result)
        }
      } 

    }
  })
}

function updateCompany() {
  companyForm.addEventListener('submit', async (e)=> {
    e.preventDefault()
    const formData = new FormData(companyForm)
    const request = {
      'method': 'PATCH',
      'body': formData
    }
    const response = await fetch(companyApi, request)
    const result = await response.json()
    companyModal.close()
    if(response.status === 200) {
      successMsg.style.display = 'block'
      successMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--success-text-color)" class="bi bi-check-all" viewBox="0 0 16 16">
      <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
    </svg> Updated Successfully!`
    } else if (response.status === 401) {
      location.assign(loginPage)
    } else {
      renderErrorMsg(result)
    }
  })
}

function updateFileDisplay() {
  // empty the previous image info
  const previews = document.querySelectorAll('.preview')
  previews.forEach(preview => preview.innerHTML = "")

  companyForm,addEventListener('change', (e) => {
    const inputFile = e.target.closest('input[type=file]')
    const curFile = inputFile.files[0]
    const curPreview = companyForm.querySelector(`.preview.${inputFile.id}`)
    if (curFile.length === 0) {   
      curPreview.textContent = 'No files currently selected for upload'
    } else {
      curPreview.textContent = curFile.name
    }
    
  }) 

  

  // inputFiles.forEach((inputFile) => {
  //   inputFile.addEventListener('change', (e) => {
  //     console.log(inputFile)
  //     const curFile = inputFile.files[0]
  //     const curPreview = companyForm.querySelector(`.preview-${inputFile.id}`)
  //     if (curFile.length === 0) {   
  //      curPreview.textContent = 'No files currently selected for upload'
  //     } else {
  //       curPreview.textContent = curFile.name
  //     };
  //   })
  // }) 
}