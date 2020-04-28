const mysql = require("mysql");

module.exports = {

    // return all employees ID, first name, last name, title, department ID, salary and manager ID
    getAllEmployees: function(connection){
        // connection.query(`SELECT first_name, CONCAT(first_name,' ' , last_name) AS 'Manager' FROM employee`, function(err, response){
        return connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id;`);
    },

    // return all departments
    getDepartments: function(connection){
        return connection.query('SELECT * FROM department');
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID for selected department
    getAllEmployeesByDepartment: function(connection, selection){
        console.log(selection)
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = ? ORDER BY employee.id`, 
        selection, function(err, response){
            console.table(response)
        })
    },

     // return all roles
    getRoles: function(connection){
        console.table(connection.query('SELECT * FROM role'))
        return connection.query('SELECT * FROM role');
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID by roles
    getAllEmployeesByRole: function(connection, selection){
        console.log(selection)
        connection.query(`SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE employee.role_id = ? ORDER BY employee.id`, 
        selection.role, function(err, response){
            console.table(response)
        })
    },

    //
    addEmployee: function(connection, response, role){
        console.log(response, role)
        connection.query(`INSERT INTO employee SET ?, role_id = ?`, 
        [response, role], function(err, response){
            console.log("Employee added")
        })
    },
}