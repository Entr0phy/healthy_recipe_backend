const express = require("express")

const router = express.Router();

const recipeController = require("../controller/recipe")

//recipe -> POST
router.post('/add',recipeController.addNewRecipe)

//recipe -> GET
router.get("/getById/:id",recipeController.getRecipeById)
module.exports = router