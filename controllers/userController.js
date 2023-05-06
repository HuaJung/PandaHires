import { User } from '../models/db.js'
import { userUpdate } from '../models/userModel.js'



const getUser = async (req, res) => {
  const userID = req.id
  const user = await User.findOne({attributes: ['name', 'position', 'email'], where: {id: userID}})

  if (!user) return res.status(400).json({'error': true, 'message': 'invalid user'})

  res.status(200).json({'data':  user})
}


const updateUser = async (req, res) => {
  const userID = req.id
  const user = req.body
  try {
    const updatedUser = await userUpdate(userID, user)

    if (updatedUser === 'duplicatedEmail') return res.status(409).json({'error': true, 'message': 'email is in use.'})

    res.status(200).json({'ok': true})

  } catch (err) {
    res.status(500).json({'error': true, 'message': err.message})
  }  
}


const deleteAccount = async (req, res) => {
  const userID = req.id
  try {
    await User.destroy({where: {id: userID}})
    res.clearCookie('token', {httpOnly: true})
    res.sendStatus(204)

  } catch (err) {
    res.status(500).json({'error': true, 'message': err.message})
  }
}

export {getUser, updateUser, deleteAccount}