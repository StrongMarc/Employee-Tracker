const mysql = require("mysql");

module.exports = {

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID
    getAllEmployees: function(connection){
        // connection.query(`SELECT first_name, CONCAT(first_name,' ' , last_name) AS 'Manager' FROM employee`, function(err, response){
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id;`,
         function(err, response){
            console.table(response)
        })
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID for selected department
    getAllEmployeesByDepartment: function(connection, selection){
        console.log(selection)
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ? ORDER BY employee.id`, 
        selection, function(err, response){
            console.table(response)
        })
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID by roles
    getAllEmployeesByRole: function(connection, selection){
        console.log(selection)
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE title = ? ORDER BY employee.id`, 
        selection.role, function(err, response){
            console.table(response)
        })
    },
}