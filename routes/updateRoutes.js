const router = require('express').Router();
const {
  patchTravelData,
  updatePlannerTitle,
} = require('../controllers/upDate');
const { updateData } = require('../controllers/upDate');

// patch : 변경 사항 부분만 업데이트
// put : 전체 업데이트

// router.patch('/update_task', updateTask);

// 수정 버튼 시 update
// router.put('/update_data', updateData);

router.patch('/patch_travel_data/:project_idx', patchTravelData);

router.patch('/update_planner_title', updatePlannerTitle);

module.exports = router;
