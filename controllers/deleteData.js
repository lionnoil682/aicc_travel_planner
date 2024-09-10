const database = require('../database/database');

exports.deleteData = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const result = await database.query('DELETE FROM users WHERE _id = $1', [
      itemId,
    ]);
    return res.status(200).json({ message: 'Task Deleted Successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Get Items Fail' + error });
  }
};

exports.deleteTravelData = async (req, res) => {
  const { user_idx, project_idx } = req.params;

  try {
    console.log('user = ' + user_idx + 'project = ' + project_idx);
    const result = await database.query(
      'DELETE FROM travel_project WHERE user_idx = $1 AND project_idx =$2',
      [user_idx, project_idx]
    );

    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ message: 'Travel Data Deleted Successfully' });
    } else {
      return res.status(404).json({ message: 'Travel Data Not Found' });
    }
  } catch (error) {
    console.error('Error deleting travel data:', error);
    return res.status(500).json({ message: 'Internal Server Error' + error });
  }
};
