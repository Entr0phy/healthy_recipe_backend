const mongoose = require("mongoose");

const Tags = require("../models/tags");

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tags.find();

    if (!tags) {
      return res.status(400).json({ error: "No tags found" });
    }

    // Group tags by tagtype
    const groupedTags = tags.reduce((acc, tag) => {
      // If the tagtype does not exist in the accumulator, add it
      if (!acc[tag.tagType]) {
        acc[tag.tagType] = [];
      }

      // Add the tag to the correct tagtype array
      acc[tag.tagType].push(tag.tag);

      return acc;
    }, {});

    res.status(200).json({ tags: groupedTags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addTags = async (req, res) => {
  const addTags = await Tags.create({
    tagType: req.body.tagType,
    tag: req.body.tag
  })

  if (!addTags) res.status(400).json({ error: err.message });

  res.status(200).json({ addTags });
};
