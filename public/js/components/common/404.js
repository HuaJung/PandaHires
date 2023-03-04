function pageNotFound() {
  const conatiner =  document.querySelector('.container')
  const h2 = document.createElement('h2')
  conatiner.innerHTML = ''
  h2.textContent = '404 NOT FOUND'
  h2.style.textAlign = 'center'
  h2.style.fontWeight = '600'
  conatiner.appendChild(h2)
}

export {pageNotFound}