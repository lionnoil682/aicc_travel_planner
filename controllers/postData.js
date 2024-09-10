const database = require('../database/database');
const { v4: uuid4 } = require('uuid');

exports.postCalendar = async (req, res) => {
  try {
    const { user_idx, startDate, endDate } = req.body;
    // console.log(req.body);
    await database.query(
      'INSERT INTO travel_project (user_idx, start_date, end_date) VALUES ($1, $2, $3)',
      [user_idx, startDate, endDate]
    );
    return res.status(201).json({ message: 'Data Created Successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
