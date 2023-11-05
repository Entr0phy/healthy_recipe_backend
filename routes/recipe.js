const express = require("express")

const router = express.Router();

const recipeController = require("../controller/recipe")

//recipe -> POST
router.post('/addRecipe',recipeController.addNewRecipe)
router.post('/addComment',recipeController.addComments)

//recipe -> GET
router.get("/getById/:id",recipeController.getRecipeById)
router.get('/recipe',recipeController.getRecipe)

//recipe -> PUT
router.put("/editRecipe",recipeController.updateRecipeById)

//recipe -> DELETE
module.exports = router.delete("/deleteRecipe",recipeController.deleteRecipeById)
