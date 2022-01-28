const Users = require('../auth/auth-model')
const bcrypt = require('bcryptjs')


async function checkSubmission(req, res, next) {
    try {
        let users = []
        let pass
        if (req.body.password) {
            pass = req.body.password
            if (pass.length <= 3) {
                next({status: 422, message: "Password must be longer than 3 chars"})

            } else if (!req.body.username) {
                next({status: 422, message: 'username and password required'})
            } else {
                users = await Users.findBy({username: req.body.username})
                if (!users.length) {
                    next()
                } else {
                    next({status: 403, message: 'username taken'})
                }
            }
        } else {
            next({status: 422, message: 'username and password required'})
        }

    } catch (err) {
        next(err)
    }
}

async function checkLogin(req, res, next) {
    try {

        if (!req.body.username || !req.body.password) {
            next({status: 400, message: 'username and password required'})

        } else {
            const [userFromDB] = await Users.findBy({username: req.body.username})
            if (!userFromDB) {
                next({status: 400, message: 'invalid credentials'})

            } else if (bcrypt.compareSync(req.body.password, userFromDB.password)) {
                next()
            } else {
                next({status: 400, message: 'invalid credentials'})
            }
        }
    } catch (err) {
        next(err)
    }
}


module.exports = {
    checkLogin,
    checkSubmission
}