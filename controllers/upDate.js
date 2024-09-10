const database = require('../database/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.patchTravelData = async (req, res) => {
  upload.single('planner_img')(req, res, async (err) => {
    if (err) {
      console.error('File upload failed:', err);
      return res
        .status(500)
        .json({ message: 'File upload failed: ' + err.message });
    }

    const { project_idx, planner_title, planner_description, planner_date } =
      req.body;

    // 새로운 이미지가 업로드된 경우 planner_img 값을 업데이트
    let planner_img;
    if (req.file) {
      planner_img =
        req.protocol +
        '://' +
        req.get('host') +
        '/uploads/' +
        req.file.filename;
      console.log('a');
    } else {
      planner_img = null;
    }

    try {
      let query, values;

      if (planner_img) {
        // 이미지가 새로 업로드되었을 때 또는 기존 이미지를 유지할 때
        query = `
          UPDATE travel_project
          SET planner_title = $1, planner_description = $2, planner_img = $3, planner_date = $4
          WHERE project_idx = $5
        `;
        values = [
          planner_title,
          planner_description,
          planner_img,
          planner_date,
          project_idx,
        ];
      } else {
        // 이미지 없이 업데이트할 때 (이미지가 없는 경우)
        query = `
          UPDATE travel_project
          SET planner_title = $1, planner_description = $2, planner_date = $3
          WHERE project_idx = $4
        `;
        values = [
          planner_title,
          planner_description,
          planner_date,
          project_idx,
        ];
      }

      const result = await database.query(query, values);

      if (result.rowCount > 0) {
        res
          .status(201)
          .json({ message: 'Travel data saved successfully!', planner_img });
      } else {
        res.status(404).json({ message: 'No record found to update.' });
      }
    } catch (error) {
      console.error('Database update failed:', error);
      res
        .status(500)
        .json({ message: 'Database update failed: ' + error.message });
    }
  });
};

// planner 제목 생성
exports.updatePlannerTitle = async (req, res) => {
  const { project_title, project_idx } = req.body;
  // console.log(req.body);

  try {
    await database.query(
      'UPDATE travel_project SET project_title = $1 WHERE project_idx = $2',
      [project_title, project_idx]
    );
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
