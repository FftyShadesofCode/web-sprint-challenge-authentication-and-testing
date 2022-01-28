const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const {buildToken} = require("./auth-helpers");
const Users = require("../users/users-model");
const {
    requireCredentials,
    checkUsernameExists,
} = require("./auth-middleware");

router.post(
    "/register",
    requireCredentials,
    checkUsernameExists,
    (req, res, next) => {
        const {username, password} = req.body;
        const hash = bcryptjs.hashSync(password, 8);
        Users.add({username, password: hash})
            .then((newUser) => {
                res.status(201).json({
                    id: newUser.id,
                    username: newUser.username,
                    password: newUser.password,
                });
            })
            .catch(next);
    }
);

router.post("/login", requireCredentials, (req, res, next) => {
    let {username, password} = req.body;

    Users.findBy({username})
        .then(([user]) => {
            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = buildToken(user);
                res.status(200).json({
                    message: `welcome, ${user.username}`,
                    token,
                });
            } else {
                next({status: 401, message: "invalid credentials"});
            }
        })
        .catch(next);
});

module.exports = router;
