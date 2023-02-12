import express from "express"
import dotenv from "dotenv"
import path, { join } from "path"
import { fileURLToPath } from "url"
import { router as baseRoute } from "./routes/index.js"
import { authRoute } from "./routes/api/auth.js"
import { jobRoute } from "./routes/api/job.js"
import { careersRoute } from "./routes/careers.js"
import { recruitRoute } from "./routes/recruiting.js"
import { error404 } from "./controllers/errorController.js"
import cookieParser from "cookie-parser"
import { sequelize } from "./models/dbConn.js"
import { verifyJWT } from "./middleware/verifyUser.js"

dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
// app.use(express.static(path.join(__dirname,'/public')))
// server static files
app.use(express.static('public'))
app.use('/careers/*', express.static('public'))
app.use('/recruiting', express.static('public'))
// app.use('/api/:companyName/jobs', express.static('public'))

// routes
app.use('/', baseRoute)
app.use('/careers', careersRoute)


app.use('/api/auth', authRoute)

// apply jwt verificaion before these routes
app.use(verifyJWT)
app.use('/recruiting', recruitRoute)
app.use('/api', jobRoute)





// 404 page
app.use(error404)

sequelize.sync().then(result => {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}).catch(err => {
  console.log(err)
})



