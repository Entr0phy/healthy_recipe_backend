const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        minLength:6,
        maxLength:15,
        required: true
    },
    password:{
        type:String,
        minLength:6,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    created_at:{
        type:Date,
        default: Date.now(),
        required:true,
    },
    dietary_preferences:{
        type: [String]
    },
    allergies:{
        type:[String]
    },
    health_goals:{
        type:[String]
    },
    favorite_recipes:[{
        type:mongoose.Types.ObjectId,
        ref:"Recipe"
    }],
    grocery_list: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }
    ]
})

module.exports = mongoose.model("User",userSchema)