import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { check, validationResult } from "express-validator"
import {users} from "../models/db.js"

const userRoute = express.Router()



userRoute.route('/signin')
  .get((req, res) => {
    res.render('auth/signin')
  })
  .put(async (req, res) => {
    const { email, pwd } = req.body

    if (!email || !pwd) return res.status(400).json({'message': 'Username and password are required'})
    const foundUser = 'lookinginto monogdb'
    if (!foundUser) return res.sendStatus(401) // unauthorized
    // or return res.status(400).json({'message': 'Invalid Credentials'})
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        {"username": foundUser.username},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '3600s' }
      )
      const refreshToken = jwt.sign(
        {"username": foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )
      // saving refresh token with current user
      res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000})
      res.json({'ok': true, 'message': accessToken})
    } else {
      res.sendStatus(401)
    }
    
  })

// router.get('/signin', (req, res) => {
//   res.render('auth/signin')
// })


userRoute.route('/signup')
  .get( (req, res) => {
    res.render('auth/signup')
  })
  .post([
    check("name").isLength({min:1}),
    check("position").isLength({min:2}),
    check("email", "Please provide a valid email").isEmail(),
    check("password").isLength({min:4})
  ], async(req, res) => {
    const { name, position, email, pwd } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }
    // Validate if user exist or not
    const duplicate = users.find((user)=> {
      return user.email === email
    })
    if (duplicate) {
      return res.status(409).json({"error": true, "message": "You already have an account"})
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const token = await jwt.sign(
      {email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 360000}
      )
    res.json("validation past")
  })


userRoute.get('/signup', (req, res) => {
  res.render('auth/signup')
})

userRoute.get('/company_info', (req, res) => {
  res.render('auth/company-form')
})



export {userRoute}