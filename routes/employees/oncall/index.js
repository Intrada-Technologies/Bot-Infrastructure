const db = require('../../../modules/db');

const get = async (req, res) => {
  let oncall = (await db.query('select * from OnCallTechs o join Employees e on e.id = o.employee_id where oncall = 1'))[0];

  oncall.map((tech) => {
    tech.Name = tech.firstname + ' ' + tech.lastname;
    delete tech.employee_id;
    delete tech.firstname;
    delete tech.lastname;
    delete tech.id;
    delete tech.oncall;
    delete tech.active;
    delete tech.deleted;
  });

  res.json(oncall);
};

module.exports = {
  get,
};
