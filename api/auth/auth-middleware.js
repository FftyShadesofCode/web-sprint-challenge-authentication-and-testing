const {find} = require("../models/users-model");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../../config");

module.exports = {
    userDoesNotExistAlready,
    reqBodyHasUsernameAndPassword,
    userDoesExist,
    tokenBuilder,
};

async function userDoesNotExistAlready(req, res, next) {
    const {username} = req.body;
    const error = {message: "username taken", status: 422};
    const user = await find(username);
    !user.length ? next() : next(error);
}

function reqBodyHasUsernameAndPassword(req, res, next) {
    const {username, password} = req.body;
    const error = {message: "username and password required"};
    username && password ? next() : next(error);
}

async function userDoesExist(req, res, next) {
    const {username} = req.body;
    const error = {message: "invalid credentials", status: 401};
    const user = await find(username);
    if (!user.length) {
        return next(error);
    }
    req.user = user[0];
    next();
}

function tokenBuilder(user) {
    const options = {expiresIn: "1d"};
    const payload = {subject: user.id, username: user.username};
    return jwt.sign(payload, JWT_SECRET, options);
}