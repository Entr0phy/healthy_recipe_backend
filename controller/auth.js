const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const User = require("../models/users");
const bcrypt = require("bcryptjs");

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
      email: req.body.email,
      dietary_preferences: req.body.dietary_preferences,
      allergies: req.body.allergies,
      health_goals: req.body.health_goals,
      favorite_recipes: [],
      grocery_list: [],
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

//@desc   Login a user
//@route  POST/login
//@access public
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });

    if (!user)
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    else {
      bcrypt.compare(password, user.password).then((match) => {
        if (match)
          res.status(200).json({
            message: "Log in successful",
            user,
          });
        else {
          res.status(400).json({
            message: "Login not successful",
            error: "Incorrect password",
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "An error occured",
      error: err.message,
    });
  }
};

//@desc   Get user by username
//@route  GET /users/:username
//@access private
exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }).exec();
  if (!user)
    res.status(400).json({
      message: "User",
    });
  res.status(200).json(user);
};

//@desc   Edit user data
//@route  PATCh /users/editUser
//@access private
exports.editUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      dietary_preferences: req.body.dietary_preferences,
      allergies: req.body.allergies,
      health_goals: req.body.health_goals,
      favorite_recipes: req.body.favorite_recipes,
      grocery_list: req.body.grocery_list,
    }
  );

  res.status(200).json(updatedUser);
};

//@desc   DELETE a user
//@route  DELETE /users/deleteUser
//@access private
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete({ _id: req.body.id });
  res.status(200).json(user);
};
