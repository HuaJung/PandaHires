import { Sequelize, Op } from "sequelize";
import { User, Company, Job, JobCandidate, Candidate } from "../models/db.js";


const getCompanyUser = async(req, res) => {
  const userID = req.id

  try{
    const data = await Company.findOne({
      where: {userId: userID},
      attributes: ['id', 'name'],
      include: {
        model: User,
        attributes: ['id', 'name'],
        required: true
      },
    })
    const companyUser = {
      'company': {
        'id': data.id,
        'name': data.id
      },
      'user':data.user
    }
    res.status(200).json({'data': companyUser})
  } catch (err) {
    res.status(500).json({ 'error': true, 'message': err.message })
  }
}

export {getCompanyUser}