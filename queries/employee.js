const mysql = require("mysql");

module.exports = {

    // return all employees ID, first name, last name, title, department ID, salary and manager ID
    getAllEmployees: function(connection){
        // https://www.mysqltutorial.org/mysql-self-join/
        // https://stackoverflow.com/questions/16013364/inner-join-with-3-tables-in-mysql
        return connection.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id;`);
    },

    // return all employees
    getEmployees: function(connection){
        return connection.query('SELECT * FROM employee');
    },

    // return all departments
    getDepartments: function(connection){
        return connection.query('SELECT * FROM department');
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID for selected department
    getAllEmployeesByDepartment: function(connection, selection){
        connection.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department_id = ? ORDER BY employee.id`, 
        selection, function(err, response){
            console.table(response)
        })
    },

     // return all roles
    getRoles: function(connection){
        return connection.query('SELECT * FROM role');
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID by roles
    getAllEmployeesByRole: function(connection, selection){
        connection.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.role_id = ? ORDER BY employee.id;`, 
        selection.role, function(err, response){
            console.table(response)
        })
    },

    // add department
    addDepartment: function(connection, name){
        connection.query(`INSERT INTO department (name) VALUES (?);`, [name], function(err, response){
            console.log("Department added");
        })
    },

    // add role
    addRole: function(connection, role, department_id){
        console.log(department_id)
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`, 
        [role.role, role.salary, department_id], function(err, response){
            console.log("Role added");
        })
    },

    // add employee
    addEmployee: function(connection, response, role, manager){
        console.log("e60")
        
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, 
        [response.first_name, response.last_name, role, manager], function(err, response){
            console.log("Employee added")
        })
    },
}