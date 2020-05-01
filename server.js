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
  
    // change each object key id of array to a value key
    let modifyRoles = roles.map(function(role) {
        return {value: role.id, name: role.title}
    })
  
    // prompt roles
    const selectRole = [
        {
            type: 'list',
            message: `Which role to view all employees?`,
            name: 'role',
            choices:  modifyRoles
        }
    ];
    
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

// function to get all database roles and prompt to select which role
async function employeeRoles() {
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
            message: `What is the employee's role?`,
            name: 'role',
            choices:  modifyRoles
        }
    ];
    
    return selectRole;
}

// function to get all database roles and prompt to select which role
async function employeeManager() {
    // get array of all employees
    let managers = await employee.getEmployees(connection)
  
    // change each object key id of array to a value key
    let modifyManagers = managers.map(function(man) {
        return {value: man.id, name: man.manager}
    })
    modifyManagers.unshift({value: null, name: "None"})
    
    console.log(modifyManagers)
    // prompt roles
    const selectManager = [
        {
            type: 'list',
            message: `What is the employee's manager?`,
            name: 'manager',
            choices:  modifyManagers
        }
    ];
    
    return selectManager;
}

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
    .prompt(toDoMenu)  // line 22
    .then(function( selection ) {
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
    // get selected department
    let departmentPrompt = await getDepartments();
    // prompt function getDepartment using departmentPrompt
    inquirer
    .prompt(departmentPrompt)
    .then(function( selection ) {
        employee.getAllEmployeesByDepartment(connection, selection.department)
        setTimeout(init, 200)
    })
}

// function to prompt for roles and display employee table by roles
async function promptForRole(){
    // get selected role
    let rolePrompt = await getRoles();

    // prompt function getRoles using rolePrompt
    inquirer
    .prompt(rolePrompt)
    .then(function( selection ) {
        employee.getAllEmployeesByRole(connection, selection)
        setTimeout(init, 200)
    })
}

// function to add department
async function addDepartment(){
    let check = false;
    try{

    // get array of all departments
    let departments = await employee.getDepartments(connection)

    // prompt newDepartment
    let response = await inquirer
        .prompt(newDepartment)  // line 145

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

    //prompt to select role
    let response = await inquirer
        .prompt(newRole)  //  line 154

        // get selected department
        let departmentPrompt = await roleDepartments();
     
        // prompt function roleDepartments using departmentPrompt
        await inquirer
        .prompt(departmentPrompt)
        .then(async function( selection ) {
            // check for duplicate department
            for (i=0; i<roles.length; i++){
                if (roles[i].title == response.role){
                    check = true;
                }
            }
            // validate
            if (response.role == ''){
            console.log('YOU MUST ENTER A ROLE NAME')
            }
            if (response.salary == ''){
                console.log('YOU MUST ENTER A SALARY FOR ROLE')
                }
            else if (check){
                console.log('Role already exists')
            }
            // add role to database
            else {
                await employee.addRole(connection, response, selection.department)
            }
        })
        setTimeout(init, 200)
    } catch (err){
        console.log(err)
    }
}

async function addEmployee(){
    try{
        // prompt for employee first and last name to add
        let response = await inquirer
        .prompt(employeeName)  // line 85
       
        // get selected role
        let employeeRole = await employeeRoles();  // line 99
        
        // prompt function employeeRoles using employeeRole
        await inquirer
        .prompt(employeeRole)
        .then(async function( selectionEmp ) {
            
            // get selected manager
            let manager = await employeeManager();  // line 122

            // prompt function employeeManager using manager
            await inquirer
            .prompt(manager)
            .then(async function( selectionMan ) {
                console.log(response.first_name, response.last_name)
                console.log(selectionEmp)
                console.log(selectionMan)
                await employee.addEmployee(connection, response, selectionEmp.role, selectionMan.manager)
            })

        setTimeout(init, 200)
        })
    } catch (err){
        console.log(err)
    }
}

// function to prompt all employees and remove selected employee
// function removeEmployee(){
//     employee.getAllEmployeesByRole(connection)
// }