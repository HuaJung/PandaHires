const error404 = (req, res) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found'})
}

const authError = (errors) => {
  let err = {name: '', position: '', email: '', password: ''}
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      err[error.param] = error.msg
    })
    return err
  }
}

export {error404, authError}