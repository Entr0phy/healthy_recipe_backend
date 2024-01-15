const express = require('express')
const router = express.Router();
const shoppingListController = require('../controller/shoppingList');

//shoppingList -> POST
router.post('/addToShoppingList',shoppingListController.addToShoppingList);

//shoppingList -> GET
router.get('/getUserShoppingList/:id',shoppingListController.getUserShoppingList)
router.get('/getNotCompletedList',shoppingListController.getNotCompletedList)

//shoppingList -> PATCH
router.patch('/updateOrderStatus',shoppingListController.updateStatus)
module.exports = router