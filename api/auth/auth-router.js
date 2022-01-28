const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./auth-model')
const {BCRYPT_ROUNDS} = require('./auth-secrets')
const {checkLogin, checkSubmission} = require('../middleware/authorize')


router.post('/register', checkSubmission, async (req, res, next) => {

    try {
        const {username, password} = req.body
        const newUser = {
            username,
            password: bcrypt.hashSync(password, BCRYPT_ROUNDS),
        }
        const created = await Users.add(newUser)
        res.status(201).json({message: {username: created.username, id: created.id, password: created.password}})
    } catch (err) {
        next(err)
    }


    /*
      2- On SUCCESSFUL registration,
        the response body should have `id`, `username` and `password`:
          "id": 1,
          "username": "Captain Marvel",
          "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      3- On FAILED registration due to `username` or `password` missing from the request body,
        the response body should include a string exactly as follows: "username and password required".

      4- On FAILED registration due to the `username` being taken,
        the response body should include a string exactly as follows: "username taken".
    */
});

router.post('/login', checkLogin, async (req, res, next) => {

    try {
        const token = await Users.createToken(req.body)
        const username = req.body.username
        res.status(200).json({message: `Welcome, ${username}`, token: token})
    } catch (err) {
        next(err)
    }


    /*
      1- In order to log into an existing account the client must provide `username` and `password`:
          "username": "Captain Marvel",
          "password": "foobar"
      2- On SUCCESSFUL login,
        the response body should have `message` and `token`:
          "message": "welcome, Captain Marvel",
          "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      3- On FAILED login due to `username` or `password` missing from the request body,
        the response body should include a string exactly as follows: "username and password required".
      4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
        the response body should include a string exactly as follows: "invalid credentials".
    */
});

module.exports = router;
