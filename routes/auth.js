const express = require("express");

const router = express.Router();

const authController = require("../controller/auth");

//auth -> POST
router.post("/user/register",authController.register)
router.post('/user/login',authController.login)
router.post('/user/addToGroceryList',authController.addToGroceryList)
router.post('/user/addFollower',authController.addFollower)

//auth -> GET
router.get("/user/getUserByUsername/:username",authController.getUserByUsername)

//auth -> DELETE
router.delete("/user/deleteUser",authController.deleteUser)
router.delete('/user/removeFromGroceryList',authController.removeFromGroceryList)
router.delete('/user/removeFollower',authController.removeFollower)

//auth -> UPDATE
router.patch('/user/updateUserDietary',authController.editUserDietary)
router.patch('/user/updateUserAllergies',authController.editUserAllergy)
router.patch('/user/updateUserHealthGoals',authController.editUserHealthGoals)
router.put('/user/updateGroceryList',authController.editGroceryList)
module.exports = router