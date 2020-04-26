const mysql = require("mysql");

module.exports = {
    getAllEmployees: function(connection){
        connection.query(`SELECT * FROM employee`, function(err, response){
            console.table(response)
        })
    },
}