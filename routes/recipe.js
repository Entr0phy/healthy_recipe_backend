const express = require("express")

const router = express.Router();

const recipeController = require("../controller/recipe")

//recipe -> POST
router.post('/addRecipe',recipeController.addNewRecipe)
router.post('/addComment',recipeController.addComments)
router.post('/searchRecipe',recipeController.searchRecipe)
router.post('/myFeed',recipeController.getMyFeedRecipes)
router.post('/getReviewedRecipe',recipeController.getMyReviewedRecipes)
//recipe -> GET
router.get("/getById/:id",recipeController.getRecipeById)
router.get('/recipe',recipeController.getRecipe)
router.get('/recipe3Latest',recipeController.getLatest3Recipe)
router.get('/reconmendedRecipe',recipeController.getReconmendedRecipes);
router.get('/featuredRecipe',recipeController.getFeaturedRecipes)

//recipe -> PUT
router.put("/editRecipe",recipeController.updateRecipeById)

//recipe -> DELETE
module.exports = router.delete("/deleteRecipe",recipeController.deleteRecipeById)
