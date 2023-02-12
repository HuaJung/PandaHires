const previewBtn = document.querySelector('button[type="sibmit"]')
const previewPage = new URL('/recruiting/preview_job', `${window.location}`)


jobForm()

function jobForm() {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const jobData = {}
    for (const [key, value] of formData) {
      jobData[`${key}`] = value
    }
    localStorage.setItem('job', JSON.stringify(jobData))
    location.assign(previewPage)
  })
}


