import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import fileUpload from 'express-fileupload'
import { router as baseRoute } from "./routes/views/index.js"
import { companyRoute } from "./routes/api/company.js"
import { userRoute } from "./routes/api/user.js"
import { careersRoute } from "./routes/views/careers.js"
import { careerRoute } from "./routes/api/career.js"
import { recruitRoute } from "./routes/views/recruiting.js"
import { authRoute } from "./routes/api/auth.js"
import { jobRoute } from "./routes/api/job.js"
import { candidateRoute } from "./routes/api/candidate.js"
import { error404 } from "./controllers/errorController.js"
import { sequelize } from "./models/dbConn.js"
import { verifyLogin } from "./middleware/verifyUser.js"
import { prebuildSatgeModel } from "./models/prebuild.js"


dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())

// server static files
app.use(express.static('public'))
app.use('/recruiting', express.static('public'))
app.use('/careers', express.static('public'))

// routes
app.use('/', baseRoute)

app.use('/careers', careersRoute)
app.use('/api/career', careerRoute)
app.use('/api/auth', authRoute) 

// apply jwt verificaion before these routes
app.use(verifyLogin)
app.use('/recruiting', recruitRoute)
app.use('/api/user', userRoute)
app.use('/api/job', jobRoute)
app.use('/api/candidate', candidateRoute)
app.use('/api/company', companyRoute)


// 404 page
app.use(error404)

sequelize.sync()
  .then(result => {
    app.listen(port, () => console.log(`Server running on port ${port}`))
  })
  .catch(err => {
    console.log(err)
  })