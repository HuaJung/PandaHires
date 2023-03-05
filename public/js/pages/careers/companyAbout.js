
import { pageNotFound } from "../../components/common/404.js";
import { getCompany, getCareersCompany, renderCompanyLogo } from "../../components/common/navCareers.js";

renderCompany()

async function renderCompany() {
  const company = await getCareersCompany()
  // render banner
  const companyImg = document.querySelector('.company-img')
  let element
  if (company.image === null) {
    element = document.createElement('h2')
    element.textContent = company.name
    element.className = 'image-txt'
  } else if (company.image.includes('https')) {
    element = document.createElement('img')
    element.src = company.image
    element.className = 'image'
  }
  companyImg.appendChild(element)

  // render about
  if (!company.title1) {
    const conatiner =  document.querySelector('.container')
    const h2 = document.createElement('h2')
    conatiner.innerHTML = ''
    const img = document.createElement('img')
    h2.style.padding = '1rem'
    h2.style.textAlign = 'center'
    h2.style.fontWeight = '600'
    img.src= '/icons/cone-striped.svg'
    h2.append(img, `Wait more info to come`)
    conatiner.appendChild(h2)

  }

  Object.entries(company).forEach(([key, value]) => {
    if (key === 'id' || key === 'name' || key === 'tel'|| key === 'address' ||key === 'logo') return

    document.querySelector(`.${key}`).textContent = value
  });

}

export {renderCompany}