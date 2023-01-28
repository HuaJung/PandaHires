import express from "express"

const router = express.Router()


router.get('^/$|/index(.html)?', (req, res) => {
  res.render('index')
})



// 404 page
router.use('/*', (req, res) => {
  res.status(404).render('404')
})


export {router}