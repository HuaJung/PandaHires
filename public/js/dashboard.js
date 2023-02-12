import { companyIdName } from "./userChecker.js";

closeJob()

function closeJob () {
  const closeBtns = document.querySelectorAll('.mini-btn-close')
  closeBtns.forEach(closeBtn => 
    closeBtn.addEventListener('click', async (e) => {
      const companyInfo = await companyIdName()
      const jobId = closeBtn.name
      const jobApi = new URL(`/api/${companyInfo.name}/jobs/${jobId}`, `${window.origin}`)
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