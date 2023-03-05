const errorGroup = document.querySelector('.error-group')
const errorMsg = document.createElement('div')
const errorText = document.createElement('span')
const triangleWarningIcon = document.createElement('img')

function renderErrorMsg(result) {
  errorMsg.className = 'error-msg'
  triangleWarningIcon.src = '/icons/triangle-warning.svg'
  errorText.textContent = result.message
  errorMsg.append(triangleWarningIcon, errorText)
  errorGroup.appendChild(errorMsg)
}

export{renderErrorMsg}