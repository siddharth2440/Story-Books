const isAuthenticated = require('../middlewares/auth');
// require('../middlewares/auth')
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/mainController');
router.get('/',isAuthenticated,controllers.dashboardHome)
//addRoutes
router.get('/add',isAuthenticated,controllers.addStory);
router.post('/add',isAuthenticated,controllers.addStoryPost);
//public Stories route
router.get('/public-stories',isAuthenticated,controllers.publicStories);
//Edit our Own Story || showEachIndividual Story in same
router.get('/edit/:id',isAuthenticated,controllers.editTheStory);
router.put('/edit/:id',isAuthenticated,controllers.updateTheStory);

//showEach public Story that is made by the Each User
router.get('/public-stories/show/:id',isAuthenticated,controllers.showParticularUserPublicStories);
//delete our own story
router.delete('/delete-story/:id',isAuthenticated,controllers.deleteStory);
module.exports = router;