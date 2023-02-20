const { Router } = require("express");
const UserRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
require("dotenv").config();

UserRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  const AlreadyReg = await userModel.find({ email: email });
  if (AlreadyReg.length > 0) {
    res.send({ msg: "User already exist, please login" });
  } else {
    bcrypt.hash(password, 3, async (err, hash) => {
      if (err) {
        res.send({ err: err });
      } else {
        const RegUser = new userModel({
          name,
          email,
          gender,
          password: hash,
          age,
          city,
        });
        await RegUser.save();
        res.send("User Registered");
      }
    });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const RegUser = await userModel.find({ email: email });
  if (RegUser.length > 0) {
    try {
      bcrypt.compare(password, RegUser[0].password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { userID: RegUser[0]._id },
            process.env.SECRET_KEY
          );
          res.send({ msg: "User LoggedIn", token: token });
        } else {
          res.send({ err: "Invalid Password" });
        }
      });
    } catch (error) {
      res.send({ error: error });
    }
  } else {
    res.send({ err: "User Not Found" });
  }
});

module.exports = {
  UserRouter,
};
