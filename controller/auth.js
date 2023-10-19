const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")

const User = require("../models/users");
const bcrypt = require("bcryptjs")

//@desc     Register a new user
//@route    POST/register
//@access   Public

exports.register = async (req, res) => {
    const userName = req.body.username;
  
    //check if user exist
    const userExist = await User.findOne({ username: userName });
  
    if (userExist)
      return res.status(400).json({ message: "Username already taken" });
  
    if (req.body.password.length < 6)
      return res.status(400).json({ message: "Password less than 6 characters" });
  
    bcrypt.hash(req.body.password, 10).then(async (hash) => {
      await User.create({
        username: userName,
        password: hash,
        email:req.body.email,
        dietary_preferences: req.body.dietary_preferences,
        allergies: req.body.allergies,
        health_goals: req.body.health_goals
      })
        .then((user) =>
          res.status(200).json({
            message: "User created successfully",
            user,
          })
        )
        .catch((err) =>
          res.status(400).json({
            message: "User not created",
            error: err.message,
          })
        );
    });
  };