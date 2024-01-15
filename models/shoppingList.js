const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
  submitted_by:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  uploaded_at:{
    type: Date,
    required: true,
    default: new Date()
  },
  shoppingList:[ {
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
  },],
  status: {
    type: String,
    required:true,
    default: 'Waiting for order to be picked up'
  }
});

module.exports = mongoose.model("ShoppingList",shoppingListSchema)
