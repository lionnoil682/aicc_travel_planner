const router = require('express').Router();
const { deleteTravelData } = require('../controllers/deleteData');

// router.delete('/delete_data/:itemId', deleteData);

router.delete('/delete_travel_data/:user_idx/:project_idx', deleteTravelData);

module.exports = router;
