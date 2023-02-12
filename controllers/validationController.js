import { check } from "express-validator"

const registerValidator = [
  check("name", "please enter an email").isLength({min:1}),
  check("position").isLength({min:2}),
  check("email", "please provide a valid email").isEmail(),
  check("password", "must at least 4 letters long").isLength({min:4})
]

const loginValidator = [
  check("email", "please provide a valid email").isEmail(),
  check("password", "must at least 4 letters long").isLength({min:4})
]

const companyValidator = [
  check("name", "please enter your company name").isLength({min:1}),
  check("country", "pleaser provide valid country").isLength({min:2}),
  check("address", "please provide company's address").isLength({min:3}),
  check("tel", "please provide valid phone number").isLength({min:6})
]
export {registerValidator, loginValidator, companyValidator}