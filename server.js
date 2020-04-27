// add npm packagmssql and inquirer
const mysql = require("mysql");
const inquirer = require("inquirer");

// add developer modules
const employee = require('./queries/employee')

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,  // mysql must use 3306
  
    // Your username
    user: 'root',
  
    // Your password
    password: 'password',
    database: 'employee_db'
});

// prompt to do menu
const toDoMenu = [
    {
        type: 'list',
        message: `What would you like to do?`,
        name: 'select',
        choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Roles"
        ]
    }
];

// prompt departments
const selectDepartment = [
    {
        type: 'list',
        message: `Which department to view?`,
        name: 'department',
        choices: [
        "1: Sales",
        "2: Engineering",
        "3: Finance",
        "4: Legal"
        ]
    }
];

// prompt roles
const selectRole = [
    {
        type: 'list',
        message: `Which roles to view all employees?`,
        name: 'role',
        choices: [
        "Sales Lead",
        "Salesperson",
        "Lead Engineer",
        "Software Engineer",
        "Accountant",
        "Legal Team Lead",
        "Lawyer"
        ]
    }
];

//  create connection
connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id "+ connection.threadId);
    
    init()
        
});

// prompt todo menu
function init(){
    inquirer
    .prompt(toDoMenu)
    .then(function( selection ) {
        console.log(selection.select)
        switch (selection.select) {

            case "View All Employees":
                GetAllEmployees();
                break;
            
            case "View All Employees By Department":
                promptForDepartment();
                break;

            case "View All Employees By Roles":
                promptForRole();
                break;
        }
    })
}

// function to display all employee table
function GetAllEmployees(){
    employee.getAllEmployees(connection)
    setTimeout(init, 200)
}

// function to prompt for department and display employee table by the selected department
function promptForDepartment(){
    inquirer
    .prompt(selectDepartment)
    .then(function( selection ) {
        console.log(selection.department)
        cut = selection.department.charAt(0)
        employee.getAllEmployeesByDepartment(connection, cut)
        setTimeout(init, 200)
    })
}

// function to prompt for roles and display employee table by roles
function promptForRole(){
    inquirer
    .prompt(selectRole)
    .then(function( selection ) {
        console.log(selection.role)
        // cut = selection.role.charAt(0)
        employee.getAllEmployeesByRole(connection, selection)
        setTimeout(init, 200)
    })
}