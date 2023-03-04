import jwt from "jsonwebtoken"


const verifyJWT = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({'error': true, 'message': 'not login yet'})
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.status(403).json({'error': true, 'message': 'forbidden'})
    req.id = decode.id
    next() 
  }) 
}

// const checkUser = (req, res, next) => {
//   const token = req.cookies.token
//   if (token) {
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
//       if (err) return res.status(403).json({'error': true, 'message': 'forbidden'})
//       req.id = decode.id
//       next() 
//     }) 
//   } else return res.status(200).json({'data': null})
// }

export {verifyJWT}   