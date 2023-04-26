import { User, Company } from "../models/db.js"
import { check } from "express-validator"



const registerValidator = [
  check("name", "Please enter your name").isLength({min:1}),
  check("position", "Please enter your position").isLength({min:2}),
  check("email", "Please provide a valid email")
    .isEmail()
    .normalizeEmail()
    .custom( async (value, {req}) => {
      const foundUser = await User.findOne({where: {email: value}})
      if (foundUser) return Promise.reject('Email exists already, please pick a different one.')
    }),
  check("password", "Must at least 4 letters long")
    .trim()
    .isLength({min:4})
    .custom((value, {req}) => {
      const numberRegex = /\d/
      if (!numberRegex.test(value)) {
        throw new Error("Password must contain at least 1 number")
      }
      return true
    })
]

const loginValidator = [
  check("email", "Please provide a valid email")
    .isEmail()
    .normalizeEmail()
    .custom(async (value, {req}) => {
      const foundUser = await User.findOne({where: {email: value}})
      if (!foundUser) return Promise.reject('The user doesn\'t exist')
    }),
  check("password", "Must at least 4 letters long")
    .trim()
    .isLength({min:4})
    .custom((value, {req}) => {
      const numberRegex = /\d/
      if (!numberRegex.test(value)) {
        throw new Error("Password must contain at least 1 number")
      }
      return true
    })
]

const companyValidator = [
  check("name", "Please enter your company name")
    .isLength({min:1})
    .custom(async (value, {req}) => {
      const foundCompany = await Company.findOne({where: {name: value}})
      if (foundCompany) return Promise.reject('The Company exists already.')
    }),
  check("country", "Please provide a valid country").isLength({min:2}),
  check("address", "Please provide company's address").isLength({min:3}),
  check("tel", "Please provide valid phone number").isLength({min:6})
]

export {registerValidator, loginValidator, companyValidator}