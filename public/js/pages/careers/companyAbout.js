
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
  if (!company.title1) return pageNotFound()

  Object.entries(company).forEach(([key, value]) => {
    if (key === 'id' || key === 'name' || key === 'tel'|| key === 'address' ||key === 'logo') return

    document.querySelector(`.${key}`).textContent = value
  });

}

export {renderCompany}