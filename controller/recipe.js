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
      likes: 0,
      dislikes: 0,
      comments: [],
      featured: false,
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

//@desc     Get a recipe by Id
//@route    GET/getById/:id
//@access   Public

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

//@desc     Edit a recipe ny Id
//@route    PUT/editRecipe
//@access   private

exports.updateRecipeById = async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      cooking_time: req.body.cooking_time,
      meal_type: req.body.meal_type,
      nutritional_data: req.body.nutritional_data,
      tags: req.body.tags,
      image_url: req.body.image_url,
    }
  );
};

//@desc     Delete a recipe by Id
//@route    DELETE/recipeById
//@access   Private
exports.deleteRecipeById = async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete({
    _id: req.params.id,
  });

  if (!recipe)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    message: "Recipe deleted",
  });
};
