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
        "Add Role"
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
            message: `Which role to view all employees?`,
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
    
// prompt department to add
const newDepartment = [
    {
        type: 'input',
        message: `What is the name of the department?`,
        name: 'department'
    }
];

// prompt role to add
const newRole = [
    {
        type: 'input',
        message: `What is the name of the role?`,
        name: 'role'
    },
    {
        type: 'input',
        message: `What is the role salary?`,
        name: 'salary'
    }
];

// function to get all database departments and prompt to select which department
async function roleDepartments() {
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
            message: `What is the role department?`,
            name: 'department',
            choices:  modifyDepartments
        }
    ];
    return selectDepartment;
}

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

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
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

// function to add department
async function addDepartment(){
    let check = false;
    try{

    // get array of all departments
    let departments = await employee.getDepartments(connection)
    console.log('prompt', departments)
    
    let response = await inquirer
        .prompt(newDepartment)
        console.log(response.department)

        // check for duplicate department
        for (i=0; i<departments.length; i++){
            if (departments[i].name == response.department){
                check = true;
            }
        }
       console.log(check)
        if (response.department == ''){
            console.log('YOU MUST ENTER A DEPARTMENT NAME')
        }
        else if (check){
            console.log('Department already exists')
        }
        else {
            await employee.addDepartment(connection, response.department)
        }
    
        setTimeout(init, 200)
    } catch (err){
        console.log(err)
    }
}

// function to add role
async function addRole(){
    let check = false;
    try{
    
    // get array of all roles
    let roles = await employee.getRoles(connection)
    console.log('prompt', roles)

    let response = await inquirer
        .prompt(newRole)
        let departmentPrompt = await roleDepartments();
            console.log(departmentPrompt)
            await inquirer
            .prompt(departmentPrompt)
            .then(async function( selection ) {
            // check for duplicate department
            for (i=0; i<roles.length; i++){
                if (roles[i].title == response.role){
                    check = true;
                }
            }
            console.log(check)
            if (response.role == ''){
            console.log('YOU MUST ENTER A ROLE NAME')
            }
            if (response.salary == ''){
                console.log('YOU MUST ENTER A SALARY FOR ROLE')
                }
            else if (check){
                console.log('Role already exists')
            }
            else {
                console.log("308")
                console.log(response.role)
                console.log(selection)
                await employee.addRole(connection, response, selection)
                console.log("hello")
            }
        })
        setTimeout(init, 200)
    } catch (err){
        console.log(err)
    }
}

// function to prompt all employees and remove
// function removeEmployee(){
//     employee.getAllEmployeesByRole(connection)
// }