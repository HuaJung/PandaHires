function validityChecker (form) {
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', (e) => {
      if (e.target.validity.valid) {
        input.classList.remove('submitted')
        input.nextElementSibling.textContent = ''
      }
    })
  })
}

export {validityChecker}