const express = require('express');
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

 //encrypt password 
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser  = User({
    username,
    password: hashPass
  });
//validate user & password insertion
  if (username === "" || password === "") {
    res.render("auth/signup", {
        errorMessage : "Indicate a username and password to sign up"
    })
    return;
  }

//validate if username already exists
  User.findOne({ "username": username }, //search condition
  "username", //projection!
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
  });

 newUser.save((err) => {
    res.redirect("/");
  });
});






module.exports = authRoutes;