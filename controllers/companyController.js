import { Company} from '../models/db.js'
import { validationResult } from "express-validator"
import { authError } from './errorController.js'
import { updateCompany, getCompany } from '../models/companyModel.js';



const createNewCompany = async(req, res) => {
  const error = authError(validationResult(req)) 
  if (error) return res.status(400).json({'error': true, 'message': error})

  const company = req.body
  company['userId'] = req.id

  try {
    await Company.create(company)
    res.status(201).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
} 


const getCompanyController = async (req, res) => {
  const userID = req.id
  try {
    const company = await getCompany(userID)

    if (!company) return res.status(400).json({'data': null})
  
    res.status(200).json({'data': company})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}


const getCompanyNameId = async (req,res) => {
  const userID = req.id
  const company = await Company.findOne({attributes:['id', 'name'], where: {userId: userID}})
  if (!company) return res.status(404).json({'data': null})

  res.status(200).json({'data': company})
}


const updateCompanyController = async (req, res) => {
  const userID = req.id
  const files = req.files
  const company = req.body

  if (Object.keys(company).length < 1 && !files) return res.status(400).json({'error': true, 'message': 'missing attributes'})

  try {    
    await updateCompany(files, userID, company)
    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}



export {createNewCompany, getCompanyController, updateCompanyController, getCompanyNameId}