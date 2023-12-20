const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const User = require("../models/users");
const bcrypt = require("bcryptjs");

//@desc     Register a new user
//@route    POST/user/register
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
      created_at: new Date(),
      dietary_preferences: req.body.dietary_preferences,
      allergies: req.body.allergies,
      health_goals: req.body.health_goals,
      favorite_recipes: [],
      grocery_list: [],
      followers: [],
      following: [],
      userType: 'user'
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
//@route  POST/user/login
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
//@route  GET /user/getUserByUsername/:username
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
//@route  PATCh /user/updateUser
//@access private
exports.editUserDietary = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      dietary_preferences: req.body.dietary_preferences,
    }
  );

  res.status(200).json(updatedUser);
};

//@desc   Edit user data
//@route  PATCh /user/updateUser
//@access private
exports.editUserAllergy = async (req, res) => {
  
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      allergies: req.body.allergies,
    }
  );

  res.status(200).json(updatedUser);
};

//@desc   Edit user data
//@route  PATCh /user/updateUser
//@access private
exports.editUserHealthGoals = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      health_goals: req.body.health_goals,
    }
  );

  res.status(200).json(updatedUser);
};

//@desc   DELETE a user
//@route  DELETE /user/deleteUser
//@access private
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete({ _id: req.body.id });
  res.status(200).json(user);
};

//@desc   Add items to grocery list
//@route  POST /user/addToGroceryList
//@acess  private
exports.addToGroceryList = async (req, res) => {
  const addToGroceryList = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $push: {
        grocery_list: {
          name: req.body.name,
          quantity: req.body.quantity,
        },
      },
    }
  );

  if (!addToGroceryList) res.status(400).json({ error: err.message });

  return res.status(200).json({ addToGroceryList });
};

//@desc   Remove item from grocery list
//@route  DELETE /user/removeFromGroceryList
//@access private

//* Needs testing
exports.removeFromGroceryList = async (req, res) => {
  const removeFromGroceryList = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $pullAll: {
        grocery_list: [{ _id: req.body.id }],
      },
    }
  );

  if (!removeFromGroceryList) res.status(400).json({ error: err.message });

  res.status(200).json({ removeFromGroceryList });
};

//@desc   Update item from grocery list
//@route  PUT /user/updateGroceryList
//@access private
exports.editGroceryList = async (req, res) => {
  const editGroceryList = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        grocery_list: {
          name: req.body.name,
          quantity: req.body.quantity,
        },
      },
    }
  );

  if (!editGroceryList) res.status(400).json({ error: err.message });

  return res.status(200).json({ editGroceryList });
};

//@desc Add a following to the current user and add the current user as a follower to the other user
//@route  POST /user/addFollowers
//@access private

//* Needs testing
exports.addFollower = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await User.findByIdAndUpdate(
      { _id: req.body.currentUser },
      {
        $push: {
          following: req.body.otherUser,
        },
      },
      { session }
    );

    await User.findByIdAndUpdate(
      { _id: req.body.otherUser },
      {
        $push: {
          followers: req.body.currentUser,
        },
      },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

//@desc   Remove a following from current user and remove the current user from the other user followers
//@route  DELETE /user/removeFollowers
//@access private

//* Needs testing
exports.removeFollower = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await User.findByIdAndUpdate(
      { _id: req.body.currentUser },
      {
        $pullAll: {
          _id: req.body.otherUser,
        },
      },
      { session }
    );

    await User.findByIdAndUpdate(
      { _id: req.body.otherUser },
      {
        $pullAll: {
          _id: req.body.currentUser,
        },
      },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
