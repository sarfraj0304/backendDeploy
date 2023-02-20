const jwt = require("jsonwebtoken");
require("dotenv").config();
const AuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      res.send({ err: err });
    } else {
      req.body.userID = decode.userID;
      next();
    }
  });
};
module.exports = {
  AuthMiddleware,
};
