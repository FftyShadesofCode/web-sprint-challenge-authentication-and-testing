const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {BCRYPT_ROUNDS} = require("../../config");
const Users = require("../models/users-model");
const {
    userDoesNotExistAlready,
    reqBodyHasUsernameAndPassword,
    userDoesExist,
    tokenBuilder,
} = require("./auth-middleware");

router.post(
    "/register",
    reqBodyHasUsernameAndPassword,
    userDoesNotExistAlready,
    (req, res, next) => {
        const {username, password} = req.body;
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
        Users.add({username, password: hash})
            .then((user) => res.json(user))
            .catch(next);
    }
);

router.post(
    "/login",
    reqBodyHasUsernameAndPassword,
    userDoesExist,
    (req, res, next) => {
        const {password} = req.body;
        const passwordMatch = bcrypt.compareSync(password, req.user.password);
        if (!passwordMatch) return next({message: "invalid credentials"});
        const token = tokenBuilder(req.user);
        res.json({
            message: `welcome, ${req.user.username}`,
            token,
        });
    }
);

module.exports = router;