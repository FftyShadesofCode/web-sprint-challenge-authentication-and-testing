const {findBy} = require("../users/users-model");

function requireCredentials(req, res, next) {
   let {username, password} = req.body;
   if (!username || !username.trim() || !password || !password.trim()) {
      res.status(400).json({message: "username and password required"});
   } else {
      next();
   }
}

async function checkUsernameExists(req, res, next) {
   try {
      const [user] = await findBy({username: req.body.username});
      if (user) {
         next({status: 422, message: "username taken"});
      } else {
         next();
      }
   } catch (err) {
      next(err);
   }
}

module.exports = {requireCredentials, checkUsernameExists};
