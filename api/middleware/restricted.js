const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../auth/auth-secrets')

module.exports = (req, res, next) => {

  console.log(req.headers)
  if (!req.headers.authorization) {
    next({status: 401, message: 'token required'})

  }
  const token = req.headers.authorization.slice(7) //for postman auth using Bearer token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next({status: 404, message: 'token invalid'})
    } else {
      req.decoded = decoded
      next()
    }
  })

  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
