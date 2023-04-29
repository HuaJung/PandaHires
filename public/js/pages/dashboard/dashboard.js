import { renderErrorMsg } from "../../components/common/errorMsg.js";
import { renderNavData, signout } from "../../components/common/navRecruiting.js";
let page = 1
const overViewTap = document.querySelector('#radio1')
const allJobsTap = document.querySelector('#radio2')
const allCandidatesTap = document.querySelector('#radio3')
const tbodyOverview = document.querySelector('.tbody-td.overview')
const tbodyJob = document.querySelector('.tbody-td.jobs')
const tbodyCandidate = document.querySelector('.tbody-td.candidates')
const li = document.createElement('li')
const h4 = document.createElement('h4')
const ul = document.createElement('ul')
const img = document.createElement('img')
const a = document.createElement('a')
const stageSelect = document.querySelector('select[name=name]')
const statusSelect = document.querySelector('select[name=status]')
const dateSelect = document.querySelector('input[name=interviewDate]')
const errorGroup = document.querySelector('.error-group')
let jobCandidateList =[]



closeJob()
tabHeaderChecked()
candidateStageSelection()
candidateStageUpdate()
candidateJobBoxChecked()



function tabHeaderChecked() {
  if (overViewTap.checked) {
    getOverview()
  } else if (allJobsTap.checked) {
    getAllJobs()
  } else if (allCandidatesTap.checked) {
    getAllCandidates()
  }
  overViewTap.addEventListener('change', () => getOverview())
  allJobsTap.addEventListener('change', () => getAllJobs())
  allCandidatesTap.addEventListener('change', () => getAllCandidates() )
}


function candidateStageSelection() {
  statusSelect.disabled = stageSelect.value.includes('Interview')? false: true
  dateSelect.disabled = !statusSelect.disabled && (statusSelect.value.includes('Scheduled'))? false: true
  stageSelect.addEventListener('change', (e) => {
    statusSelect.disabled = e.target.value.includes('Interview')? false: true
    dateSelect.disabled = !statusSelect.disabled && (statusSelect.value.includes('Scheduled')) ? false: true
  })
  statusSelect.addEventListener('change', () => {
    dateSelect.disabled = statusSelect.value.includes('Scheduled') || statusSelect.value=== 'Rescheduled' ? false: true
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
  updateForm.addEventListener('submit', async(e) => {
    e.preventDefault()
    errorGroup.innerHTML = ''
    if (jobCandidateList.length < 1) return renderErrorMsg({message: 'Please check the canidate you want to update'})

    const stageFormData = new FormData(updateForm)
    const stageData = {
      jobCandidateId: jobCandidateList,
      interviewDate: stageFormData.has('interviewDate')? stageFormData.get('interviewDate'): null,
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
      location.reload()
      allCandidatesTap.checked
    } else {
      renderErrorMsg(result)
    }
  })
}

async function getOverview() {
  errorGroup.innerHTML = ''
  tbodyOverview.innerHTML = ''
  const overviewApi = new URL('api/job/overview', window.origin)
  const response = await fetch(overviewApi)
  const result = await response.json()
  if (result.data === null) {
    const h3 = document.createElement('h3')
    const img = document.createElement('img')
    h3.style.padding = '1rem'
    img.src= '/icons/clipboard-data-fill.svg'
    h3.append(img, `Let's get started`)
    tbodyOverview.appendChild(h3)
  } else if(result.data) {
    renderOverview(result.data)
  } else {
    renderErrorMsg(result)
  }
}

async function getAllCandidates() {
  errorGroup.innerHTML = ''
  tbodyCandidate.innerHTML = ''
  const candidateApi = new URL(`api/candidate?page=${page}`, window.origin)
  const response = await fetch(candidateApi)
  const result = await response.json()
  if (result.data === null){
    const h3 = document.createElement('h3')
    const img = document.createElement('img')
    h3.style.padding = '1rem'
    img.src= '/icons/file-spreadsheet.svg'
    h3.append(img, `You haven't added any candidates yet`)
    tbodyCandidate.appendChild(h3)
  } else if (result.data) {
    renderCandidatesAndJobs(result.data)
    showResume()
  } else {
    renderErrorMsg(result)
  }

}


async function getAllJobs() {
  errorGroup.innerHTML = ''
  tbodyJob.innerHTML = ''
  const jobApi = new URL(`api/job/all?page=${page}`, window.origin) 
  const response = await fetch(jobApi)
  const result = await response.json()
  if (result.data === null) {
    const h3 = document.createElement('h3')
    const img = document.createElement('img')
    h3.style.padding = '1rem'
    img.src= '/icons/file-spreadsheet.svg'
    h3.append(img, `You haven't created any jobs yet`)
    tbodyJob.appendChild(h3)
  } else if (result.data) {
    renderTeamsAndJobs(result.data)
  } else {
    renderErrorMsg(result)
  }
}

function renderOverview(overviewData) {
  for (const [key,value] of Object.entries(overviewData)) {
    if (key === 'total') {
      const gridTd = li.cloneNode()
      gridTd.className = 'grid-td overview'
      const totalHeader = h4.cloneNode()
      h4.textContent = 'Total'
      const totalIcon = img.cloneNode()
      totalIcon.src = '/icons/bar-chart-fill.svg'
      const totalLi = li.cloneNode()
      totalLi.className = 'grid-total'
      totalLi.append(totalIcon,h4,)
      gridTd.appendChild(totalLi)

      const totalEle = [
        { content: value.applicantToday},
        { content: value.applicantPast7Day},
        { content: value.interviewToday},
        { content: value.interviewNext7Day},
        { content: value.offerPast7Day}
      ]
      totalEle.forEach(ele => {
        const element = li.cloneNode()
        element.textContent = ele.content
        gridTd.appendChild(element)
      })
      tbodyOverview.appendChild(gridTd)
    } else {    
      value.forEach(job => {
      const gridTr = ul.cloneNode()
      gridTr.className = 'grid-tr primary overview'
  
      const overviewEle = [
        { content: job.name},
        { content: job.applicantToday},
        { content: job.applicantPast7Day},
        { content: job.interviewToday},
        { content: job.interviewNext7Day},
        { content: job.offerPast7Day}
      ]
      overviewEle.forEach(ele => {
        const element = li.cloneNode()
        element.textContent = ele.content
        gridTr.appendChild(element)
      })
      tbodyOverview.appendChild(gridTr)
      })
    }
  }
}


function renderCandidatesAndJobs(candidateData) {
  candidateData.forEach(({id, firstName, lastName, jobs})=> {
    const gridTd = li.cloneNode()
    gridTd.className = 'grid-td candidates'

    const candidateLink = a.cloneNode()
    candidateLink.textContent = `${firstName} ${lastName}`

    const personIcon = img.cloneNode()
    personIcon.src = '/icons/person-fill.svg'

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
      jobStatus.className = job.jobStatus === 'Open'? 'job-status active': 'job-status'
      jobStatus.textContent = job.jobStatus
      const candidateNameLi = li.cloneNode()
      candidateNameLi.append(inputCheck, "  ",job.jobName, jobStatus)

      gridTr.appendChild(candidateNameLi)

      const resumeObj = document.createElement('object')
      resumeObj.data = job.resume
      const resumeModal = document.createElement('dialog')
      resumeModal.className = 'resume-modal'
      resumeModal.appendChild(resumeObj)

      const resumeIcon = img.cloneNode()
      resumeIcon.className = 'preview-resume'
      resumeIcon.src = '/icons/pdf.svg'
      const resumeLi = li.cloneNode()
      resumeLi.dataset.title = 'Resume'
      resumeLi.append(resumeIcon, resumeModal)

      const jobEle = [
        { content: job.stage, data: 'Stage'},
        { content: job.stageStatus, data: 'Status'},
        { content: job.interviewDate, data: 'Interview'},
        { content: job.appliedDate.split(' ')[0], data: 'Applied Date'},
        { content: job.origin, data: 'Origin' }
      ]
      jobEle.forEach((ele) => {
        let element = li.cloneNode()
        if (ele.content.includes('N/A')) {
          element.style.fontSize = '12px'
          element.style.color = 'var(--third-text-color)'
        }
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
      pencil.src = '/icons/pencil.svg'
      const close = img.cloneNode()
      close.className = 'close'
      close.src = '/icons/x-lg.svg'
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
}


function showResume() {
  tbodyCandidate.addEventListener('click', (e) => {
    e.stopPropagation()
    const previewResumeBtn = e.target.closest('.preview-resume')

    if (previewResumeBtn) {
      const resumeModal = previewResumeBtn.nextSibling
      resumeModal.showModal()
    }
    const openMdal = e.target.closest('dialog[open]')
    if (openMdal) {
      openMdal.close()
    }
  })
}