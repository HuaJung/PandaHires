const navLink = document.querySelectorAll('.nav-link')



if (window.location.pathname.includes('job_openings')) {
  navLink[0].classList.add('active')
} else if (window.location.pathname.includes('about')) {
  navLink[1].classList.add('active')
}