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

const post = async (req, res) => {
  let sender = req.body.sender ? req.body.sender.toLowerCase() : '';
  let modifer = req.body.modifer ? req.body.modifer.toLowerCase() : '';
  let department = req.body.department ? req.body.department.toLowerCase() : '';
  let modified = req.body.modified ? req.body.modified.toLowerCase() : '';

  let isAdmin = (await db.query('select isAdmin from Employees where username = ?', [sender]))[0];
  
  if (isAdmin.length == 0 || isAdmin[0].isAdmin == 0) {
    res.json('You are not an admin, action denied');
    return;
  }



  if (modifer == 'add') {
    let modifiedEmployee = (await db.query('select * from Employees where department = ? and firstname = ? or lastname = ? or username = ? or id = ?', [department, modified, modified, modified, modified]))[0];
    if (modifiedEmployee.length == 0) {
      res.json('Could not find employee, action denied');
      return;
    } else if (modifiedEmployee.length > 1) {
      res.json('Found more than one employee, action denied');
    }

    let onCallTech = (await db.query('select * from OnCallTechs where employee_id = ?', [modifiedEmployee[0].id]))[0];
    if (onCallTech.length > 0) {
      res.json('Employee is already aviable to be on call, action denied');
      return;
    }

    await db.query('insert into OnCallTechs (employee_id, oncall) values (?, 1)', [modifiedEmployee[0].id]);
    res.json(`${modifiedEmployee[0].firstname + ' ' + modifiedEmployee[0].lastname} has been marked aviable to be on call`);
    return;
  } else if (modifer == 'remove' || modifer == 'delete') {
    // remove employee from onCallTechs table
    let modifiedEmployee = (await db.query('select * from Employees where department = ? and firstname = ? or lastname = ? or username = ? or id = ?', [department, modified, modified, modified, modified]))[0];
    if (modifiedEmployee.length == 0) {
      res.json('Could not find employee, action denied');
      return;
    } else if (modifiedEmployee.length > 1) {
      res.json('Found more than one employee, action denied');
    }

    let onCallTech = (await db.query('select * from OnCallTechs where employee_id = ?', [modifiedEmployee[0].id]))[0];
    if (onCallTech.length == 0) {
      res.json('Employee is already not aviable to be on call, action denied');
      return;
    }

    await db.query('delete from OnCallTechs where employee_id = ?', [modifiedEmployee[0].id]);

    res.json(`${modifiedEmployee[0].firstname + ' ' + modifiedEmployee[0].lastname} has been marked not aviable to be on call`);
    return;
  } else if (modifer == 'set') {
    let modifiedEmployee = (await db.query('select * from Employees where department = ? and firstname = ? or lastname = ? or username = ? or id = ?', [department, modified, modified, modified, modified]))[0];
    if (modifiedEmployee.length == 0) {
      res.json('Could not find employee, action denied');
      return;
    } else if (modifiedEmployee.length > 1) {
      res.json('Found more than one employee, action denied');
    }

    let onCallTechAviable = (await db.query('select * from OnCallTechs where employee_id = ?', [modifiedEmployee[0].id]))[0];
    if (onCallTechAviable.length == 0) {
      res.json('Employee is not aviable to be on call, action denied');
      return;
    }


    let onCallTech = (await db.query('select * from OnCallTechs where employee_id = ? and oncall = 1', [modifiedEmployee[0].id]))[0];
    if (onCallTech.length != 0) {
      res.json('Employee is already on call, action denied');
      return;
    }

    // find the employee that is currently on call for the given department found in the employee table
    let currentOnCallTech = (await db.query('select * from OnCallTechs o join Employees e on e.id = o.employee_id where e.department = ? and o.oncall = 1', [department]))[0];
    if (currentOnCallTech.length != 0) {
      await db.query('update OnCallTechs set oncall = 0 where employee_id = ?', [currentOnCallTech[0].employee_id]);
    }
    
    // set the new employee to on call
    await db.query('update OnCallTechs set oncall = 1 where employee_id = ?', [modifiedEmployee[0].id]);
    res.json(`${modifiedEmployee[0].firstname + ' ' + modifiedEmployee[0].lastname} has been set to on call`);
    return;
  }else{
    res.json('Invalid modifer, action denied');
  }

};

module.exports = {
  get,
  post,
};
