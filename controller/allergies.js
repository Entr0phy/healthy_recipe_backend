const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Allergies = require("../models/allergies");

//@desc     Add a new allergy
//@route    POST/allergy
//@access   private

exports.addAllergy = async (req, res) => {
  const allergy = req.body.name;

  const allergyExist = await Allergies.findOne({ name: allergy });

  if (allergyExist)
    return res.status(400).json({ message: "Allergy already exist" });
  try {
    await Allergies.create({
      name: req.body.name,
    }).then((result) => {
      res.status(200).json({
        message: "Successfully added allergy",
        result,
      });
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.searchAllergy = async (req, res) => {
  if (req.body.search === "") return res.status(200).json({ allergy: [] });
  const sanitizedInput = req.body.search.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  );
  const regex = new RegExp("^" + sanitizedInput, "i");

  const allergy = await Allergies.find({ name: regex });
  if (!allergy) res.status(400).json({ error: err.message });

  res.status(200).json({ allergy });
};
