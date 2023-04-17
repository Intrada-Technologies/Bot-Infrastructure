const db = require('../../modules/db');


const get = async (req, res) =>{
    let exts = (await db.query('select * from Extentions ext join Employees e on e.id = ext.employee_id'))[0]

    exts.map(ext => {
        ext.Name = ext.firstname + ' ' + ext.lastname
        ext.Extension = ext.extension
        delete ext.employee_id
        delete ext.extension
        delete ext.firstname
        delete ext.lastname
        delete ext.id
    })

    res.json(exts)
}

module.exports = {
    get
}
