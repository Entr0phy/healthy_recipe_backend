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
      qualifications: [],
      userType: "user",
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

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).exec();
  if (!user)
    res.status(400).json({
      message: "User",
    });
  res.status(200).json(user);
};

//@desc   Get fav recipe of user
//@route  GET /user/getUserByUsername/:username
//@access private
exports.getUserFavRecipe = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username })
    .populate("favorite_recipes")
    .exec();
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
//@access  private
exports.addToGroceryList = async (req, res) => {
  try {
    const userId = req.body.id;
    const groceryItems = req.body.groceryItems; // Assuming this is an array of items

    const user = await User.findOne({_id:userId});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    groceryItems.forEach((newItem) => {
      const existingItemIndex = user.grocery_list.findIndex(
        (item) => item.name === newItem.ingredientName
      );

      if (existingItemIndex > -1) {
        // Item exists, update its quantity
        user.grocery_list[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Item does not exist, add new item
        user.grocery_list.push({
          name: newItem.ingredientName,
          quantity: newItem.quantity,
          unitOfMeasure: newItem.unitOfMeasure,
        });
      }
    });

    await user.save();
    return res.status(200).json({ grocery_list: user.grocery_list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//@desc   Remove item from grocery list
//@route  DELETE /user/removeFromGroceryList
//@access private

exports.removeFromGroceryList = async (req, res) => {
  const removeFromGroceryList = await User.updateOne(
    { _id: req.body.id },
    {
      $pull: {
        grocery_list: { _id: req.body.groceryId },
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
  const editGroceryList = await User.updateOne(
    { _id: req.body.id},
    {
      $set: {
        grocery_list: req.body.grocery_list
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
};

//@desc   Add a recipe to favorite_recipes
//@route  POST /user/addToFavorites
//@access private
exports.addToFavoriteRecipe = async (req, res) => {
  const addToFav = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $push: {
        favorite_recipes: req.body.recipeId,
      },
    }
  );

  if (!addToFav)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    addToFav,
  });
};

//@desc  Remove a recipe from favorite_recipes
//@route  DELETE /user/removeFromFavorites
//@access private
exports.removeFromFavorite = async (req, res) => {
  const removeFromFav = await User.updateOne(
    {
      _id: req.body.id,
    },
    {
      $pull: { favorite_recipes: req.body.recipeId },
    }
  );

  if (!removeFromFav)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    removeFromFav,
  });
};

//@desc Add qualification to a dietitian
//@route POST /user/addQualification
//@access private
exports.addQualification = async (req, res) => {
  const addQualification = await User.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $push: {
        qualifications: {
          qualifications: req.body.qualifications,
          dateObtained: req.body.dateObtained,
        },
      },
    }
  );

  if (!addQualification)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    addQualification,
  });
};
