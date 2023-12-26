const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Recipe = require("../models/recipe");

//@desc     Register and add a new recipe
//@route    POST/addRecipe
//access    Private

exports.addNewRecipe = async (req, res) => {
  try {
    await Recipe.create({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      prep_time: req.body.prep_time,
      cooking_time: req.body.cooking_time,
      meal_type: req.body.meal_type,
      nutritional_data: req.body.nutritional_data,
      tags: req.body.tags,
      image_url: req.body.image_url,
      submitted_by: req.body.submitted_by,
      ratings: 0,
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
  }).populate("comments.name");
  if (!recipe)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    recipe,
  });
};

//@desc     Edit a recipe by Id
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
//@route    DELETE /deleteRecipe
//@access   Private
exports.deleteRecipeById = async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete({
    _id: req.body.id,
  });

  if (!recipe)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    message: "Recipe deleted",
  });
};

//@desc   Add a comment to a recipe
//@route  POST /addComment
//@access private

//needs testing**
exports.addComments = async (req, res) => {
  const addComment = await Recipe.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $inc: { ratings: req.body.ratings },
      $push: {
        comments: {
          name: req.body.name,
          ratings: req.body.ratings,
          comments: req.body.comments,
        },
      },
    }
  );

  if (!addComment)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    addComment,
  });
};

//@desc   GET all recipe
//@route  GET /recipe
//@access public

exports.getRecipe = async (req, res) => {
  const recipe = await Recipe.find();
  if (!recipe) res.status(400).json({ error: err.message });

  res.status(200).json({ recipe });
};

//@desc   GET recipe by tags
//@route  POST /recipeByTags
//@access private

//needs testing**
exports.getRecipeByTags = async (req, res) => {
  const recipe = await Recipe.find({
    tags: { $in: req.body.tags },
  });
  if (!recipe) res.status(400).json({ error: err.message });

  res.status(200).json({ recipe });
};

exports.searchRecipe = async (req, res) => {
  if (req.body.search === "") return res.status(200).json({ recipe: [] });
  const sanitizedInput = req.body.search.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  );
  const regex = new RegExp("^" + sanitizedInput, "i");

  const recipe = await Recipe.find({ name: regex });
  if (!recipe) res.status(400).json({ error: err.message });

  res.status(200).json({ recipe });
};

//@desc   GET latest 3 recipes
//@route  GET/latest3recipe
//@access public

exports.getLatest3Recipe = async (req, res) => {
  const query = await Recipe.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .exec()

  res.status(200).json({query})
};

//@desc   GET reconmended recipes
//@route  GET /reconmendedRecipe
//@access public

exports.getReconmendedRecipes = async (req, res) => {
  const query = await Recipe.find()
  .limit(3)
  .exec();

  res.status(200).json({query})
}

//@desc   GET featured recipes
//@route  GET/featuredRecipe
//@access public

exports.getFeaturedRecipes = async (req, res) => {
  const query = await Recipe.find({featured:true})
  .exec();

  res.status(200).json({query})
}

exports.getMyFeedRecipes = async (req,res) => {
  const query = await Recipe.find({submitted_by: req.body.id})
  .exec();

  res.status(200).json({query})
}

exports.getMyReviewedRecipes = async (req, res) => {
  const query = await Recipe.find({ 'comments.name' : req.body.name })
  .exec();

  res.status(200).json({query})
}