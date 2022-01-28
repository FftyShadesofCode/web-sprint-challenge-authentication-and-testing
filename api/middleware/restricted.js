const db = require('../../data/dbConfig')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../auth/secrets')

const restricted = (req, res, next) => {

    const token = req.headers.authorization
    if (!token) {
        next({status: 401, message: 'token required'})
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next({status: 401, message: 'token invalid'})
        }
        req.decodedJwt = decoded
        next()
    })
    /*
      IMPLEMENT

      1- On valid token in the Authorization header, call next.

      2- On missing token in the Authorization header,
        the response body should include a string exactly as follows: "token required".

      3- On invalid or expired token in the Authorization header,
        the response body should include a string exactly as follows: "token invalid".
    */
};
const checkIfUsernameTaken = async (req, res, next) => {
    const username = await db('users').where('username', req.body.username).first()
    if (username) {
        next({status: 401, message: 'username taken'})
    } else {
        next()
    }
}

const checkIfUsernameExists = async (req, res, next) => {
    const username = await db('users').where('username', req.body.username).first()
    if (username) {
        next()
    } else {
        next({status: 401, message: 'invalid credentials'})
    }
}

const validation = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        next({status: 422, message: 'username and password required'})
    } else {
        next()
    }
}


const errorHandling = (err, req, res, next) => {//eslint-disable-line
    res.status(err.status || 500).json({
        message: `${err.message}`
    })
}

module.exports = {
    restricted,
    checkIfUsernameTaken,
    checkIfUsernameExists,
    errorHandling,
    validation,
}