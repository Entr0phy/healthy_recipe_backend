const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Blog = require("../models/blog");
const bcrypt = require("bcryptjs");

//@desc     Add a new blog post
//@route    POST/blog
//@access   private

exports.newBlog = async (req, res) => {
  try {
    await Blog.create({
      title: req.body.tile,
      body: req.body.body,
      author: req.body.id,
    }).then((result) => {
      res.status(200).json({
        message: "Successfully added a new blog",
        result,
      });
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
