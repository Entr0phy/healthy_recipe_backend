const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  cooking_time: {
    type: Number,
    required: true,
  },
  prep_time: {
    type: Number,
    required: true,
  },
  meal_type: {
    type: String,
    required: true,
  },
  nutritional_data: {
    calories: {
      type: Number,
    },
    carbohydrates: {
      type: Number,
    },
    sodium: {
      type: Number,
    },
    protein: {
      type: Number,
    },
    fat: {
      type: Number,
    },
  },
  tags: {
    type: [String],
  },
  image_url: {
    type: String,
    required: true,
  },
  submitted_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  ratings: {
    type: Number,
    required: true,
  },
  comments: [
    {
      name: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      ratings: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
    },
  ],
  featured: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
