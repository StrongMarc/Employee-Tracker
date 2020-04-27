const mysql = require("mysql");

module.exports = {
    getAllEmployees: function(connection){
        // connection.query(`SELECT first_name, CONCAT(first_name,' ' , last_name) AS 'Manager' FROM employee`, function(err, response){
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id;`,
         function(err, response){
            console.table(response)
        })
    },
}