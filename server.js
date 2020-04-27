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

// prompt to do menu
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
        }
    })
}

function GetAllEmployees(){
    employee.getAllEmployees(connection)
    setTimeout(init, 200)
}

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