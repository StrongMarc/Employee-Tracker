// add npm packagmssql and inquirer
const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

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
        "View All Employees By Roles",
        "Add Employee",
        "Add Department",
        "Add Roles"
        // "Remove Employee"
        ]
    }
];

// function to get all database departments and prompt to select which department
async function getDepartments() {
    // get array of all departments
    let departments = await employee.getDepartments(connection)

    // change each object key id of array to a value key
    let modifyDepartments = departments.map(department => {
        return {value: department.id, name: department.name}
    })
    console.log(modifyDepartments)
    // prompt departments
    const selectDepartment = [
        {
            type: 'list',
            message: `Which department to view?`,
            name: 'department',
            choices:  modifyDepartments
        }
    ];
    return selectDepartment;
    console.log(selectDepartment)
}

// function to get all database roles and prompt to select which role
async function getRoles() {
    // get array of all roles
    let roles = await employee.getRoles(connection)
    console.log(roles)
    // change each object key id of array to a value key
    let modifyRoles = roles.map(function(role) {
        return {value: role.id, name: role.title}
    })
    console.log(modifyRoles)
    // prompt roles
    const selectRole = [
        {
            type: 'list',
            message: `Which roles to view all employees?`,
            name: 'role',
            choices:  modifyRoles
        }
    ];
    console.log(selectRole)
    return selectRole;
}

// prompt for employee name
const employeeName = [
    {
        type: 'input',
        message: `What is the employee's first name?`,
        name: 'first_name',
    },
    {
        type: 'input',
        message: `What is the employee's last name?`,
        name: 'last_name',
    }
];

//  create connection
connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id "+ connection.threadId);
    
    init()
        
});

// turn the callback function into promise
connection.query = util.promisify(connection.query)

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
                
            case "Add Employee":
                addEmployee();
                break;

            // case "Remove Employee":
            //     removeEmployee();
            //     break;
        }
    })
}

// function to display all employee table
async function GetAllEmployees(){
    let employees = await employee.getAllEmployees(connection)
    console.table(employees)
    init()
}

// function to prompt for which department and display employee table by the selected department
async function promptForDepartment(){
    let departmentPrompt = await getDepartments();
    inquirer
    .prompt(departmentPrompt)
    .then(function( selection ) {
        console.log(selection)
        employee.getAllEmployeesByDepartment(connection, selection.department)
        setTimeout(init, 200)
    })
}

// function to prompt for roles and display employee table by roles
async function promptForRole(){
    let rolePrompt = await getRoles();
    console.log('prompt', rolePrompt)
    inquirer
    .prompt(rolePrompt)
    .then(function( selection ) {
        console.log(selection)
        employee.getAllEmployeesByRole(connection, selection)
        setTimeout(init, 200)
    })
}

function addEmployee(){
    inquirer
    .prompt(employeeName)
    .then(function( response ) {
        console.log(response.firstName, response.lastName)
        inquirer
        .prompt(selectRole)
        .then(function( role ) {
            console.log(response.first_name, response.last_name, role)
            employee.addEmployee(connection, response, role)
        })
    // setTimeout(init, 200)
    })
}

// function to prompt all employees and remove
// function removeEmployee(){
//     employee.getAllEmployeesByRole(connection)
// }