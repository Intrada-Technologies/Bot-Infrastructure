const db = require('../../modules/db');

const get = async (req, res) => {
  let suggestions = (await db.query('select s.suggestion, s.status, e.firstname from Suggestions s left outer join Employees e on s.user_id = e.id where s.done = 0'))[0];
  res.json(suggestions);
};

const post = async (req, res) => {
  let suggestion = req.body.suggestion;
  let username = req.body.username;
  if ((suggestion, username)) {
    let user_id = (await db.query('select id from Employees where username = ?', [username]))[0][0].id;

    await db.query('insert into Suggestions (suggestion, user_id) values (?, ?)', [suggestion, user_id]);

    res.json({ message: `Saved ${username}'s suggestion: ${suggestion}` });
  } else {
    res.json({ message: 'Woops! Something went wrong!' });
  }
};

module.exports = {
  get,
  post,
};
