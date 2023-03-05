
import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { getCompany, getCareersCompany, renderCompanyLogo, getSingleJob } from "../../components/common/navCareers.js";
const applyBtn = document.querySelector('.button-wrapper') 
const applyModal = document.querySelector('.modal-dialog')
const closeModal = document.querySelector('.close-btn')
const thankyouBox = document.querySelector('.thankyou')


renderSingleJob()
showApplicationForm()
submitApplication()
closeBox()

const inputFile = document.querySelector('input[type=file]')
inputFile.addEventListener('change', updateFileDisplay)


async function renderSingleJob() {
  const jobData = await getSingleJob()
  Object.entries(jobData).forEach(([key, value])=> {
    if (key === 'id' || !value) return
    if (key.includes('preferred') && value) {
      const preferredSection = document.querySelectorAll('.job')[4]
      const preferredParentNode = preferredSection.parentNode
      const hr = document.createElement('hr')
      preferredParentNode.insertBefore(hr, preferredSection)
      const preferredEle = [
        {
          element: 'h2',
          className: null,
          content: 'Preferred Qualification'
        },
        {
          element: 'p',
          className: null,
          content: value
        }
      ]
      preferredEle.forEach((ele) => {
        let element = document.createElement(ele.element)
        element.className = ele.className
        element.textContent = ele.content
        preferredSection.appendChild(element)
      }) 
    } else {
      document.querySelector(`.${key}`).textContent = value
    }
  })

}

function showApplicationForm() {
  applyBtn.addEventListener('click', (e)=> {
    e.stopPropagation()
    applyModal.showModal()
  })
  closeModal.addEventListener('click', () => {
      applyModal.close()
  })
}


function updateFileDisplay() {
  const inputFile = document.querySelector('input[type=file]')
  // empty the previous image info
  const preview = document.querySelector('.preview')
  preview.innerHTML = ""
  const curFile = inputFile.files[0];
  if (curFile.length === 0) {   
    preview.textContent = 'No files currently selected for upload';
  } else {
    preview.textContent = curFile.name
  };
};


function submitApplication() {
  const form = document.querySelector('form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const submitBtn = document.querySelector('.btn-submit')
    submitBtn.disabled= true
    const jobId = window.location.pathname.split('/')[4]
    const candidateApi = new URL(`/api/career/apply?id=${jobId}`, window.origin)
    const formData = new FormData(form)
    const request = {
      'method': 'POST',
      'body': formData
    }
    const response = await fetch(candidateApi, request)
    const result = await response.json()
    if (response.status === 201) {
      // popout thank you box
      thankyouBox.style.display = 'block'
      const body = document.querySelector('body')
      body.style.backgroudColor = 'var(--third-text-color)'
    } else {
       renderErrorMsg()
    }
    submitBtn.disabled= false
  })
}

function closeBox() {
  const closeBtn = document.querySelector('.close-btn.box')
  closeBtn.addEventListener('click', () => {
    thankyouBox.style.display = 'none'
    applyModal.close()
})
}