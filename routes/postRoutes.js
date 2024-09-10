const router = require('express').Router();
const { postCalendar } = require('../controllers/postData');
const { postUser, loginUser } = require('../controllers/postUsers');

router.post('/register', postUser);
router.post('/login', loginUser);
// router.post('/post_travel_data', postTravelData);

// router.post('/postProjectTitle', postProject);

router.post('/post_calendar', postCalendar);

module.exports = router;
