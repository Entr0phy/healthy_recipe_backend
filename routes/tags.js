const express = require('express')
const router = express.Router();

const tagsController = require('../controller/tags')

//tags -> GET
router.get('/getTags', tagsController.getAllTags)

//tags -> POST
router.post('/addTags',tagsController.addTags)

module.exports = router