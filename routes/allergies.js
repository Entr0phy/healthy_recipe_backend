const express = require('express')

const router = express.Router();

const allergiesController = require('../controller/allergies')

//allergies -> POST
router.post('/addAllergies',allergiesController.addAllergy);
router.post('/searchAllergies',allergiesController.searchAllergy);

module.exports = router