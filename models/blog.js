const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  body:{
    type:String,
    required:true
  },
  author:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  uploaded_at:{
    type: Date,
    required: true
  },
  comments:[
    
  ]
});
