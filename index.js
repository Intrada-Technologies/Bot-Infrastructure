require('dotenv').config();
const db = require('./modules/db');
var bodyParser = require('body-parser');
const express = require('express');
const { createRouter } = require('express-file-routing');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded());

const auther = async (req, res, next) => {
  let token = (await db.query('select * from authorization where active = 1'))[0];
  token = token.find((t) => t.token == req.headers['x-api-key']);
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
};
app.use(auther);

createRouter(app);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
