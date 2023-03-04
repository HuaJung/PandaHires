function emptyFieldChecker(input) {
  // const input = document.querySelector(`input[name=${key}]`)
  const key = input.name
  if (!input.value) {
    input.setCustomValidity(`Please fill up your ${key}`);
    return input.reportValidity()
  } else {
    input.setCustomValidity('')
  }
};

export {emptyFieldChecker}