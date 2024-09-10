const database = require('../database/database'); // database 가져오기

exports.getData = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const result = await database.query(
      'SELECT * FROM users WHERE user_id = $1',
      [user_id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ msg: 'Get Items Fail' + error });
  }
};

exports.getTravelData = async (req, res) => {
  try {
    const { user_idx } = req.params;
    const result = await database.query(
      'SELECT project_idx, project_title, start_date, end_date, planner_title, planner_description, planner_date, planner_img FROM travel_project WHERE user_idx=$1 ORDER BY update_date DESC LIMIT 8',
      [user_idx]
    );
    res.status(201).json(result.rows);
  } catch (error) {
    console.error('Error fetching travel data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProjectData = async (req, res) => {
  const { user_idx } = req.params;
  try {
    const result = await database.query(
      'SELECT project_idx, project_title, start_date, end_date, planner_title, planner_description, planner_date, planner_img FROM travel_project WHERE user_idx=$1 ORDER BY update_date DESC LIMIT 8',
      [user_idx]
    );
    // console.log('Server Response:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCalendarData = async (req, res) => {
  const { user_idx } = req.params;

  try {
    const result = await database.query(
      'SELECT project_idx, start_date, end_date FROM travel_project WHERE user_idx = $1 ORDER BY update_date DESC LIMIT 1',
      [user_idx]
    );

    // 날짜를 문자열 형식으로 포맷팅 (YYYY-MM-DD)
    const formattedResult = result.rows.map((row) => ({
      project_idx: row.project_idx, // project_idx 포함
      start_date: row.start_date.toISOString().split('T')[0], // 'YYYY-MM-DD'
      end_date: row.end_date.toISOString().split('T')[0], // 'YYYY-MM-DD'
    }));

    // console.log(req.params);
    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching travel data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
