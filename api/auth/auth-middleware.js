const User = require("../users/users-model");

const checkUsernameFree = async (req, res, next) => {
    try {
        const {username} = req.body
        const [existing_user] = await User.findBy({username})
        if (!existing_user) {
            next()
        } else {
            next({status: 422, message: 'username taken'})
        }
    } catch (err) {
        next(err)
    }
}

async function checkUsernameExists(req, res, next) {
    try {
        const {username} = req.body
        const [exist_user] = await User.findBy({username})
        if (!exist_user) {
            next({status: 401, message: `invalid credentials`})
        } else {
            req.user = exist_user;
            next()
        }
    } catch (err) {
        next(err)
    }
}

const notEmpty = (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password || username.trim().length < 1 || password.trim().length < 1 || typeof username !== 'string' || typeof password !== 'string') {
        next({status: 422, message: 'username and password required'})
    } else {
        next()
    }
}


module.exports = {
    checkUsernameFree,
    notEmpty,
    checkUsernameExists
}