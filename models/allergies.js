const mongoose = require("mongoose");

const Schema = mongoose.Schema

const allergiesSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Allergies",allergiesSchema)