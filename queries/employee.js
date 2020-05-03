const mysql = require("mysql");

module.exports = {

    // return all employees ID, first name, last name, title, department ID, salary and manager ID
    getAllEmployees: function(connection){
        // https://www.mysqltutorial.org/mysql-self-join/
        // https://stackoverflow.com/questions/16013364/inner-join-with-3-tables-in-mysql
        return connection.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id;`);
    },

    // return all employees with first and last name
    getEmployees: function(connection){
        return connection.query(`SELECT id, CONCAT(first_name,' ' , last_name) AS 'manager' FROM employee`);
    },

    // return all departments
    getDepartments: function(connection){
        return connection.query('SELECT * FROM department');
    },

    // console table all employees ID, first name, last name, title, department ID, salary and manager ID for selected department
    getAllEmployeesByDepartment: function(connection, selection){
        connection.query(`SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department_id = ? ORDER BY employee.id`, 
        selection, function(err, response){
            if (err){
                console.log('Error')
                console.log(err)
            }
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
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.table(response)
        })
    },

    // add department
    addDepartment: function(connection, name){
        connection.query(`INSERT INTO department (name) VALUES (?);`, [name], function(err, response){
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.log("Department added");
        })
    },

    // add role
    addRole: function(connection, role, department_id){
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`, 
        [role.role, role.salary, department_id], function(err, response){
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.log("Role added");
        })
    },

    // add employee
    addEmployee: function(connection, response, role, manager){
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, 
        [response.first_name, response.last_name, role, manager], function(err, response){
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.log("Employee added")
        })
    },

    updateEmployeeRole: function(connection, employee_id, role_id){
        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, 
        [role_id, employee_id], function(err, response){
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.log("Employee Role updated")
        })
    },

    deleteEmployee: function(connection, employee_id){
        console.log("e74")
        connection.query(`DELETE FROM employee WHERE ?`, employee_id, function(err, res){
            if (err){
                console.log('Error')
                console.log(err)
            }
            console.log("Employee deleted")
        })
    },
}