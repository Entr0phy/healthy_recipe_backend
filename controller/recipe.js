const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Recipe = require("../models/recipe");
const User = require("../models/users");

//@desc     Register and add a new recipe
//@route    POST/addRecipe
//access    Private

exports.addNewRecipe = async (req, res) => {
  try {
    const createRecipe = Recipe.create({
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
      verificationStatus: req.body.verificationStatus,
      questions: [],
    });

    let updateAchievementPromise = Promise.resolve(); // Initialize as a resolved promise

    if (req.body.verificationStatus === false) {
      // If verificationStatus is false, update the achievement
      updateAchievementPromise = User.findByIdAndUpdate(
        { _id: req.body.submitted_by },
        { $inc: { "badges.customise": 1 } }
      ).exec();
    }

    // Use Promise.all to wait for both createRecipe and updateAchievement (if applicable)
    await Promise.all([createRecipe, updateAchievementPromise]);

    res.status(200).json({
      message: "Recipe added successfully.",
    });
  } catch (err) {
    console.log(err);
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
  })
    .populate("comments.name")
    .populate("questions.questionName")
    .populate("questions.answerName")
    .populate("submitted_by");
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
    { _id: req.body.id },
    {
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      cooking_time: req.body.cooking_time,
      prep_time: req.body.prep_time,
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

exports.addComments = async (req, res) => {
  try {
    const addComment = Recipe.findByIdAndUpdate(
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
    ).exec();

    const user = req.body.userInfo;
    const recipe = req.body.recipeInfo;
    
    const incrementObj = {
      "badges.review": 1, // Always increment the review badge count
    };

    user.health_goals.includes("Lose Weight") &&
    recipe.tags.includes("Low Calorie")
      ? (incrementObj["badges.low_calorie"] = 1)
      : null; // Use null to indicate no increment
    user.health_goals.includes("Gain Muscle") &&
    recipe.tags.includes("High Protein")
      ? (incrementObj["badges.high_protein"] = 1)
      : null;
    user.health_goals.includes("Lower Blood Pressure") &&
    recipe.tags.includes("Low Sodium")
      ? (incrementObj["badges.low_sodium"] = 1)
      : null;
    user.health_goals.includes("Reduce Blood Sugar") &&
    recipe.tags.includes("Low Sugar + Low GI")
      ? (incrementObj["badges.low_sugarGI"] = 1)
      : null;
    user.health_goals.includes("Lower Cholesterol") &&
    recipe.tags.includes("Low Fat")
      ? (incrementObj["badges.low_fat"] = 1)
      : null;

    const updateBadges = User.findByIdAndUpdate(
      { _id: user._id },
      { $inc: incrementObj }
    ).exec();

    await Promise.all([addComment, updateBadges]);

    res.status(200).json({
      message: "Comment added and badges updated successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};


//@desc   DELETE a comment
//@route  DELETE /deleteComment
//@access private

exports.deleteComments = async (req, res) => {
  const deleteComment = await Recipe.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $inc: { ratings: -req.body.ratings },
      $pull: {
        comments: { _id: req.body.commentId },
      },
    }
  );

  if (!deleteComment)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    deleteComment,
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

exports.searchRecipe = async (req, res) => {
  try {
    const query = {};

    // Add name search condition if search field is provided
    if (req.body.search && req.body.search.trim() !== "") {
      const sanitizedInput = req.body.search.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const regex = new RegExp(sanitizedInput, "i");
      query.name = regex;
    }

    // Add tags condition if tags are provided
    if (req.body.tags && req.body.tags.length) {
      query.tags = { $in: req.body.tags };
    }

    let findQuery = Recipe.find(query);

    // Add sorting if a sort field is provided
    if (req.body.sort && req.body.sort.trim() !== "") {
      findQuery = findQuery.sort(req.body.sort);
    }
    const recipe = await findQuery;

    res.status(200).json({ recipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//@desc   GET latest 3 recipes
//@route  GET/latest3recipe
//@access public

exports.getLatest3Recipe = async (req, res) => {
  const query = await Recipe.find({verificationStatus: true}).sort({ createdAt: -1 }).limit(3).exec();

  res.status(200).json({ query });
};

//@desc   GET reconmended recipes
//@route  GET /reconmendedRecipe
//@access public

exports.getRecommendedRecipes = async (req, res) => {
  try {
    const randomRecipes = await Recipe.aggregate([
      { $match: {verificationStatus: true}} ,
      { $sample: { size: 3 } }
    ]);

    res.status(200).json(randomRecipes);
  } catch (err) {
    console.error("Error fetching random recipes:", err);
    res.status(500).json({ message: "Failed to fetch random recipes" });
  }
};


//@desc   GET featured recipes
//@route  GET/featuredRecipe
//@access public

exports.getFeaturedRecipes = async (req, res) => {
  const query = await Recipe.find({ featured: true }).exec();

  res.status(200).json({ query });
};

exports.getMyFeedRecipes = async (req, res) => {
  const query = await Recipe.find({ submitted_by: req.body.id }).exec();

  res.status(200).json({ query });
};

exports.getMyReviewedRecipes = async (req, res) => {
  const query = await Recipe.find({ "comments.name": req.body.name }).exec();

  res.status(200).json({ query });
};

//@desc   POST new question
//@route  POST/question
//@access private

exports.postQuestion = async (req, res) => {
  const askQuestion = await Recipe.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $push: {
        questions: {
          questionName: req.body.questionName,
          question: req.body.question,
        },
      },
    }
  );

  if (!askQuestion)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    askQuestion,
  });
};

exports.postAnswer = async (req, res) => {
  const postAnswer = await Recipe.updateOne(
    { _id: req.body.id, "questions._id": req.body.recipeId },
    {
      $set: {
        "questions.$.answer": req.body.answer,
        "questions.$.answerName": req.body.answerName,
      },
    }
  );

  if (!postAnswer)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    postAnswer,
  });
};

exports.getNotVerifiedRecipe = async (req, res) => {
  const getNotVerifiedRecipe = await Recipe.find({
    verificationStatus: false,
  }).populate("submitted_by");

  if (!getNotVerifiedRecipe)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    getNotVerifiedRecipe,
  });
};

exports.verifyRecipe = async (req, res) => {
  try {
    // Update the recipe's verificationStatus
    const verifyRecipe = Recipe.findByIdAndUpdate(
      { _id: req.body.id },
      { verificationStatus: true }
    ).exec();

    // Update the user's badges
    const updateAchievement = User.findByIdAndUpdate(
      { _id: req.body.userId },
      { $inc: { "badges.verify": 1 } }
    ).exec();

    // Wait for both updates to complete concurrently
    const [recipeUpdateResult, userUpdateResult] = await Promise.all([
      verifyRecipe,
      updateAchievement,
    ]);

    // Check if both updates were successful
    if (!recipeUpdateResult || !userUpdateResult) {
      return res.status(400).json({
        error: "Error updating recipe or user",
      });
    }

    // Both updates were successful
    return res.status(200).json({
      message: "Recipe verified and badge updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.setFeaturedRecipe = async (req, res) => {
  const setFeatured = await Recipe.findByIdAndUpdate(
    { _id: req.body.id },
    { featured: true }
  );

  if (!setFeatured)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    setFeatured,
  });
};

exports.removeFeaturedRecipe = async (req, res) => {
  const setFeatured = await Recipe.findByIdAndUpdate(
    { _id: req.body.id },
    { featured: false }
  );

  if (!setFeatured)
    res.status(400).json({
      error: err.message,
    });

  res.status(200).json({
    setFeatured,
  });
};

//@desc   GET latest recipes
//@route  GET/latestRecipe
//@access public

exports.getLatestRecipe = async (req, res) => {
  const query = await Recipe.find({verificationStatus: true}).sort({ createdAt: -1 }).exec();

  res.status(200).json({ query });
};