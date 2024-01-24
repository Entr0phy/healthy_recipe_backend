const mongoose = require("mongoose");

const ShoppingList = require("../models/shoppingList");
const Users = require("../models/users");
const { off } = require("../models/recipe");

//@desc     ADD to shopping list
//@route    POST/addToShoppingList
//@access   Private

exports.addToShoppingList = async (req, res) => {
  try {
    const addToShoppingList = await ShoppingList.create({
      submitted_by: req.body.submitted_by,
      shoppingList: req.body.shoppingList,
    });

    if (addToShoppingList) {
      const updateUser = await Users.findByIdAndUpdate(
        { _id: req.body.submitted_by },
        {
          $set: {
            grocery_list: [],
          },
        }
      );

      if (updateUser) res.status(200).json({ addToShoppingList, updateUser });
      else res.status(400).send("Updating User failed");
    } else res.status(400).send("Creation Failed");
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

//@desc     GET shoppingList of User
//@route    /GET/getUserShoppingList/:id
//@access   private

exports.getUserShoppingList = async (req, res) => {
  const { id } = req.params;
  const shoppingList = await ShoppingList.find(
    {
      submitted_by: id,

    },
  ).sort({'uploaded_at' : -1});

  if (!shoppingList)
    res.status(400).json({
      message: "Error",
    });
  res.status(200).json(shoppingList);
};

//@desc     GET all non completed orders
//@route    /GET/getNonCompletedOrder
//@access   private

exports.getNotCompletedList = async (req, res) => {
  const shoppingList = await ShoppingList.find({
    status: { $ne: "Completed" },
  }).populate("submitted_by");

  if (!shoppingList)
    res.status(400).json({
      message: "Error",
    });

  res.status(200).json(shoppingList);
};

//@desc     UPDATE status of order
//@route    /PATCH/updateOrder
//@access   private
exports.updateStatus = async (req, res) => {
  const updateStatus = await ShoppingList.findByIdAndUpdate(
    {
      _id: req.body.id,
    },
    {
      status: req.body.status,
    }
  );

  if (!updateStatus)
    res.status(400).json({
      message: "Error",
    });

  res.status(200).json(updateStatus);
};
