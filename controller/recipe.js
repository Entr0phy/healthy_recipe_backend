const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Recipe = require("../models/recipe");

//@desc     Register and add a new recipe
//@route    POST/add
//access    Private

exports.addNewRecipe = async (req, res) => {
  try {
    await Recipe.create({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      cooking_time: req.body.cooking_time,
      meal_type: req.body.meal_type,
      nutritional_data: req.body.nutritional_data,
      tags: req.body.tags,
      image_url: req.body.image_url,
      submitted_by: req.body.submitted_by,
    }).then((result) => {
      res.status(200).json({
        message: "Recipe successfully added",
        result,
      });
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getRecipeById = async (req, res) => {
  const recipe = await Recipe.find({
    _id: req.params.id,
  });
  if (!recipe)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    recipe,
  });
};
