const express = require("express");

const router = express.Router();

const authController = require("../controller/auth");

//auth -> POST
router.post("/register",authController.register)
router.post('/login',authController.login)

//auth -> GET
router.get("/getUserByUsername/:username",authController.getUserByUsername)
module.exports = router