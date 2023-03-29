const loginPage = new URL('/siginin', `${window.origin}`)
const companyApi = new URL('api/company', `${window.origin}`)
const compayPage = new URL('/company_info', `${window.origin}`)


async function companyInfo() {
  const response = await fetch(companyApi)
  const result = await response.json()
  if (result.data === null) {
    window.location = compayPage
  } else if (response === 401) {
    window.location == loginPage
  } else {
    return result.data
  }
}


export {companyInfo}

