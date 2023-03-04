import express from "express"
import { deleteAccount, getUser, updateUser } from "../../controllers/userController.js"

const userRoute = express.Router()

userRoute.route('/')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteAccount)




export {userRoute}