import jwt from "jsonwebtoken"


const verifyJWT = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.redirect('/')
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.redirect('/')
    req.id = decode.id
    next() 
  }) 
}


export {verifyJWT}   