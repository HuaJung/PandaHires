import exp from "constants"
import express from "express"
import path, { join } from "path"
import { fileURLToPath } from "url"
import {router as baseRoute} from "./routes/index.js"
import {router as userRoute} from "./routes/user.js"
import {router as careerRoute} from "./routes/career.js"


const app = express()
const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static('public'))
app.use('/user', express.static('public'))
app.use('/career/company_name', express.static('public'))
app.use('/career/company_name/job', express.static('public'))
app.use('/career/company_name/job/number', express.static('public'))
app.use('/user', userRoute)
app.use('/career/company_name', careerRoute)
app.use('/', baseRoute)





app.listen(port, () => console.log(`Server running on port ${port}`))