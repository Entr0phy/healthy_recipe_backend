const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 6,
    maxLength: 15,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  dietary_preferences: {
    type: [String],
  },
  allergies: {
    type: [String],
  },
  health_goals: {
    type: [String],
  },
  favorite_recipes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  grocery_list: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitOfMeasure: {
        type: String,
        required: true,
      },
      recipeId: {
        type: mongoose.Types.ObjectId,
        ref: 'Recipe'
      }
    },
  ],
  followers: [
    {
      name: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  following: [
    {
      name: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  userType: {
    type: String,
    enum: ["user", "admin", "dietitian"],
    default: "user",
  },
  qualifications: [
    {
      qualifications: {
        type: String,
      },
      dateObtained: {
        type: String,
      },
    },
  ],
  badges: {
    low_calorie: {
      type: Number,
      required: true,
      default: 0
    },
    high_protein: {
      type: Number,
      required: true,
      default: 0
    },
    low_sodium: {
      type: Number,
      required: true,
      default: 0
    },
    low_sugarGI: {
      type: Number,
      required:true,
      default: 0
    },
    low_fat: {
      type:Number,
      required: true,
      default:0
    },
    review: {
      type: Number,
      required: true,
      default:0
    },
    customise: {
      type: Number,
      required: true,
      default: 0
    },
    verify: {
      type: Number,
      required: true,
      default:0
    },
    cart: {
      type: Number,
      requited: true,
      default:0
    }
  }
});

module.exports = mongoose.model("User", userSchema);
