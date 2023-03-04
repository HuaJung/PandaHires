import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { renderNavData, signout } from "../../components/common/navRecruiting.js";
let page = 1
const jobApi = new URL(`api/job/all?page=${page}`, window.origin) 
const candidateApi = new URL(`api/candidate?page=${page}`, window.origin)
const tbodyJob = document.querySelector('.tbody-td.jobs')
const tbodyCandidate = document.querySelector('.tbody-td.candidates')
const li = document.createElement('li')
const div = document.createElement('div')
const h4 = document.createElement('h4')
const ul = document.createElement('ul')
const img = document.createElement('img')
const a = document.createElement('a')
const stageSelect = document.querySelector('select[name=name]')
const statusSelect = document.querySelector('select[name=status]')
const dateSelect = document.querySelector('input[name=interviewDate]')
let jobCandidateList =[]



closeJob()
tabHeaderChecked()
candidateStageSelection()
candidateStageUpdate()
candidateJobBoxChecked()

function tabHeaderChecked() {
  const overViewTap = document.querySelector('#radio1')
  const allJobsTap = document.querySelector('#radio2')
  const allCandidatesTap = document.querySelector('#radio3')
  if (overViewTap.checked) {

  } else if (allJobsTap.checked) {
    getAllJobs()
  } else if (allCandidatesTap.checked) {
    getAllCandidates()
  }
  overViewTap.addEventListener('change', () => { })
  allJobsTap.addEventListener('change', () => getAllJobs())
  allCandidatesTap.addEventListener('change', () => getAllCandidates() )
}


function candidateStageSelection() {
  statusSelect.disabled = stageSelect.value.includes('Interview')? false: true
  dateSelect.disabled = stageSelect.value.includes('Interview')? false: true
  stageSelect.addEventListener('change', (e) => {
    statusSelect.disabled = e.target.value.includes('Interview')? false: true
    dateSelect.disabled = stageSelect.value.includes('Interview')? false: true
  })
}

function candidateJobBoxChecked() {
  tbodyCandidate.addEventListener('change', (e) => {
    const jobChecked = e.target.closest('input[type=checkbox]')
    if (jobChecked.checked) {
      jobCandidateList.push(jobChecked.dataset.id)
    } else {
      const index = jobCandidateList.indexOf(jobChecked.dataset.id)
      jobCandidateList.splice(index, 1)
    }
  })
}

function candidateStageUpdate() { 
  const updateForm = document.querySelector('.grid-form.update')
  // const upadteBtn = document.querySelector('.mini-btn-update')
  updateForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    if (jobCandidateList.length < 1) return renderErrorMsg({message: 'Please check the canidate you want to update'})

    const stageFormData = new FormData(updateForm)

    const stageData = {
      jobCandidateId: jobCandidateList,
      interviewDate: stageFormData.has('interviewDate')? stageFormData.get('interviewDate'):null,
      stage: {
        name: stageFormData.get('name'), 
        status: stageFormData.has('status')? stageFormData.get('status'): null
      }
    } 
    
    const request = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(stageData)
    }
    const stageApi = new URL('api/candidate/stage', window.origin)
    const response = await fetch(stageApi, request)
    const result = await response.json()
    if (response.status === 200) {
      const errorGroup = document.querySelector('.error-group')
      errorGroup.innerHTML = ''
      jobCandidateList.forEach((number) => {
        const jobSection = document.querySelector(`ul[data-id="${number}"]`)
        const jobStage = jobSection.querySelector('li[data-title=Stage]')
        const jobStatus = jobSection.querySelector('li[data-title=Status]')
        jobStage.textContent = stageFormData.get('name')
        jobStatus.textContent = stageFormData.has('status')? stageFormData.get('status'): 'N/A'
      })
    } else {
      renderErrorMsg(result)
    }
  })
}

async function getAllCandidates() {
  tbodyCandidate.innerHTML = ''
  const response = await fetch(candidateApi)
  const result = await response.json()
  if (result.data === null){
    const h3 = document.createElement('h3')
    const img = document.createElement('img')
    img.src= 'icons/file-spreadsheet.svg'
    h3.append(img, `You haven't created any job yet`)
    tbodyCandidate.appendChild(h3)
  } else if (result.data) {
    renderCandidatesAndJobs(result.data)
  } else {
    renderErrorMsg(result)
  }
}


async function getAllJobs() {
  tbodyJob.innerHTML = ''
  const response = await fetch(jobApi)
  const result = await response.json()
  if (result.data === null) {
    const h3 = document.createElement('h3')
    const img = document.createElement('img')
    img.src= 'icons/file-spreadsheet.svg'
    h3.append(img, `You haven't created any job yet`)
    tbodyJob.appendChild(h3)
  } else if (result.data) {
    renderTeamsAndJobs(result.data)
  } else {
    renderErrorMsg()
  }
}

function renderCandidatesAndJobs(candidateData) {
  candidateData.forEach(({id, firstName, lastName, jobs})=> {
    const gridTd = li.cloneNode()
    gridTd.className = 'grid-td candidates'

    const candidateLink = a.cloneNode()
    candidateLink.href = `/candidates/${id}`
    candidateLink.textContent = `${firstName} ${lastName}`

    const personIcon = img.cloneNode()
    personIcon.src = 'icons/person-fill.svg'

    const candidateHeader = h4.cloneNode()
    candidateHeader.className = 'candidate-name'

    candidateHeader.appendChild(candidateLink)
    gridTd.append(personIcon, candidateHeader)

    const tbodyTr = li.cloneNode()
    tbodyTr.className = 'tbody-tr candidates'

    jobs.forEach((job)=> {
      const gridTr = ul.cloneNode()
      gridTr.className = 'grid-tr primary candidates'
      gridTr.dataset.id = job.jobCandidateId
      
      const inputCheck = document.createElement('input')
      inputCheck.type = 'checkbox'
      inputCheck.className = 'job-checkbox'
      inputCheck.dataset.id = job.jobCandidateId

      const jobStatus = document.createElement('small')
      jobStatus.className = job.jobStage === 'Open'? 'job-status active': 'job-status'
      jobStatus.textContent = job.jobStatus
      const candidateNameLi = li.cloneNode()
      candidateNameLi.append(inputCheck, "  ",job.jobName, jobStatus)

      gridTr.appendChild(candidateNameLi)

      const resumeLink = a.cloneNode()
      resumeLink.href = job.resume
      const resumeIcon = img.cloneNode()
      resumeIcon.className = 'resume'
      resumeIcon.src = 'icons/pdf.svg'
      resumeLink.appendChild(resumeIcon)
      const resumeLi = li.cloneNode()
      resumeLi.appendChild(resumeLink)

      const jobEle = [
        { content: job.stage, data: 'Stage'},
        { content: job.stageStatus, data: 'Status'},
        { content: job.interviewDate, data: 'Interview'},
        { content: job.appliedDate.split(' ')[0], data: 'Applied Date'},
        { content: job.origin, data: 'Origin' }

      ]
      jobEle.forEach((ele) => {
        let element = li.cloneNode()
        element.textContent = ele.content
        element.dataset.title = ele.data
        gridTr.appendChild(element)
      })
      gridTr.appendChild(resumeLi)
      tbodyTr.appendChild(gridTr)
    })
    tbodyCandidate.append(gridTd, tbodyTr)
  })
}


function renderTeamsAndJobs(jobData) {
  jobData.forEach(({team, jobs}) => {
    const gridTd = li.cloneNode()
    gridTd.className = 'grid-td'
    const teamEle = [
      { ele: 'div', class: 'triangle-down',  content: null},
      { ele: 'h4', class: 'team',  content: team }
    ]
    teamEle.forEach(ele => {
      let element = document.createElement(ele.ele)
      element.className = ele.class
      element.textContent = ele.content
      gridTd.appendChild(element)
    })

    const tbodyTr = li.cloneNode()
    tbodyTr.className = 'tbody-tr'

    jobs.forEach((job) => {
      const gridTr = ul.cloneNode()
      gridTr.className = 'grid-tr primary jobs'
      const jobEle = [
        { content: job.name },
        { content:job.employmentType},
        { content: job.workType},
        { content: job.applicants },
        { content: job.interviewCount},
        { content: job.offerCount },
        { content: job.updatedAt.split('T')[0]}
      ]
      jobEle.forEach(ele => {
        let element = li.cloneNode()
        element.textContent = ele.content
        gridTr.appendChild(element)
      })
      const editLi = li.cloneNode()
      const editLink = a.cloneNode()
      editLink.className = 'edit'
      editLink.href = `/recruiting/edit_job/${job.id}`
      const pencil = img.cloneNode()
      pencil.src = 'icons/pencil.svg'
      const close = img.cloneNode()
      close.className = 'close'
      close.src = 'icons/x-lg.svg'
      close.dataset.id = job.id

      editLink.appendChild(pencil)
      editLi.append(editLink, close)
      gridTr.appendChild(editLi)
      tbodyTr.appendChild(gridTr)
    })
    tbodyJob.append(gridTd, tbodyTr)
  })
}



function closeJob () {
  tbodyJob.addEventListener('click', async(e) => {
    const closeBtn = e.target.closest('.close')
    if (closeBtn) {
      const jobId = closeBtn.dataset.id
      const updateJobApi = new URL(`/api/job/${jobId}`, window.origin)
      const request = {
        'method': 'PATCH',
        'headers': {'Content-Type': 'application/json'},
        'body': JSON.stringify({status: 'Close'})
      }
      const response = await fetch(updateJobApi, request)
      const result = await response.json()
      if (response.status === 200) {
        closeBtn.parentNode.parentElement.remove()
      } else {
        renderErrorMsg(result)
      }
    }

  })
  const closeBtns = document.querySelectorAll('.close')
  closeBtns.forEach(closeBtn => 
    closeBtn.addEventListener('click', async() => {
      const company = await comapnyInfo()
      const jobId = closeBtn.name
      const jobApi = new URL(`/api/job/${company.id}/jobs/${jobId}`, `${window.origin}`)
      const response = await fetch(jobApi, {'method': 'DELETE'})
      const result = await response.json()
      if (response.status === 200) {
        closeBtn.parentNode.parentElement.remove()
      } else {
        console.log(result.message)
      }
    } )
    )
}