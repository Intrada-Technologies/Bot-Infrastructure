const db = require('../../modules/db');


const get = async (req, res) =>{
    let paramater = req.params.param
    let exts = (await db.query('select * from Extentions ext join Employees e on e.id = ext.employee_id '))[0]

    exts.map(ext => {
        ext.Name = ext.firstname + ' ' + ext.lastname
        ext.Extension = ext.extension
        delete ext.employee_id
        delete ext.extension
        delete ext.firstname
        delete ext.lastname
        delete ext.id
    })

    if (isNaN(parseInt(paramater))){
        exts = exts.filter(ext => ext.Name.toLowerCase().includes(paramater.toLowerCase()))
    } else{    
        exts = exts.find(ext => ext.Extension.toString() == paramater.toString())
    }

    res.json(exts)
}

module.exports = {
    get
}
