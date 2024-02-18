const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers')

//Home-Page-Route
router.get('/',controller.homePage);

module.exports = router;