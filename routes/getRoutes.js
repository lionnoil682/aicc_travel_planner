const router = require('express').Router();
const {
  getTravelData,
  getProjectData,
  getCalendarData,
} = require('../controllers/getData');

// router.get('/get_data/:user_id', getData);

router.get('/get_travel_data/:user_idx/:project_idx', getTravelData);

router.get('/get_project_data/:user_idx', getProjectData);

router.get('/get_calendar_date/:user_idx', getCalendarData);

module.exports = router;
