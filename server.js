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
        "Remove Employee",
        "Update employee role",
        "Add Department",
        "Add Role"
        ]
    }
];

// function to get all database departments and prompt question based on option
async function getDepartments(option) {
    // get array of all departments
    let departments = await employee.getDepartments(connection)

    // change each object key id of array to a value key
    let modifyDepartments = departments.map(department => {
        return {value: department.id, name: department.name}
    })
    
    if(option == 1){
        // prompt departments to view
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
    else {
        // prompt departments for role
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

}

// function to get all database roles and prompt to select which role based on option
async function getRoles(option) {
    // get array of all roles
    let roles = await employee.getRoles(connection)
  
    // change each object key id of array to a value key
    let modifyRoles = roles.map(function(role) {
        return {value: role.id, name: role.title}
    })
    
    if(option == 1){
        // prompt roles to view
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
    else {
        // prompt roles for employee
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
async function whichEmployee(option) {
    // get array of all employees
    let managers = await employee.getEmployees(connection)
  
    // change each object key id of array to a value key
    let modifyManagers = managers.map(function(man) {
        return {value: man.id, name: man.manager}
    })
    
    if(option == 2){
        // add object None to first index  of array
        modifyManagers.unshift({value: null, name: "None"})

        // prompt manager for employee
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
    else if (option == 3){
        // prompt employees to update
        const selectEmployee = [
            {
                type: 'list',
                message: `Which employee to update?`,
                name: 'employee',
                choices:  modifyManagers
            }
        ];
        return selectEmployee;
    }
    else {
        // prompt employees to update
        const selectEmployee = [
            {
                type: 'list',
                message: `Which employee do you want to remove?`,
                name: 'id',
                choices:  modifyManagers
            }
        ];
        return selectEmployee;
    }
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
            
            case "Update employee role":
                updateEmployeeRole();
                break;

            case "Remove Employee":
                removeEmployee();
                break;
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
    option = 1;  // Set to "1" as a check to view
    // get selected department
    let departmentPrompt = await getDepartments(option);
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
    option = 1;  // Set to "1" as a check to view
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
        .prompt(newDepartment)  // line 153

        // check for duplicate department
        for (i=0; i<departments.length; i++){
            if (departments[i].name == response.department){
                check = true;
            }
        }
        // validation
        if (response.department == ''){
            console.log('YOU MUST ENTER A DEPARTMENT NAME')
        }
        else if (check){
            console.log('Department already exists')
        }
        else {
            await employee.addDepartment(connection, response.department)
        }
    
        init();
    } catch (err){
        console.log(err)
    }
}

// function to add role
async function addRole(){
    option = 2;  // Set to "2" as a check for selecting department
    let check = false;  // check for validation
    try{
    
    // get array of all roles
    let roles = await employee.getRoles(connection)

    //prompt to select role
    let response = await inquirer
        .prompt(newRole)  //  line 162
        
        // get selected department
        let departmentPrompt = await getDepartments(option);
     
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
    option = 2;  // Set to "2" as a check for selecting role or manager
    try{
        // prompt for employee first and last name to add
        let response = await inquirer
        .prompt(employeeName)  // line 114
        
        // validate
        if (response.first_name == '' || response.last_name == ''){
            console.log('YOU MUST ENTER BOTH A FIRST AND LAST NAME')
        }
        else {
            // get selected role
            let employeeRole = await getRoles(option);  // line 99
        
            // prompt function getRoles using employeeRole
            await inquirer
            .prompt(employeeRole)
            .then(async function( selectionEmp ) {
                
                // get selected manager
                let manager = await whichEmployee(option);  // line 128

                // prompt function whichEmployee using manager
                await inquirer
                .prompt(manager)
                .then(async function( selectionMan ) {
                    await employee.addEmployee(connection, response, selectionEmp.role, selectionMan.manager)
                })
            })
        }
        setTimeout(init, 200)
    } catch (err){
        console.log(err)
    }
}

async function updateEmployeeRole(){
    option = 3; // // Set to "3" as a check to update
    try{
        // get selected employee
        let selectedEmployee = await whichEmployee(option);  // line 128
   
        // prompt function whichEmployee using selectedEmployee
        await inquirer
        .prompt(selectedEmployee)
        .then(async function( selection ) {
            // get selected role
            let employeeRole = await getRoles(option);  // line 99
            
            // prompt function getRoles using employeeRole
            await inquirer
            .prompt(employeeRole)
            .then(async function( selectionEmp ) {
                await employee.updateEmployeeRole(connection, selection.employee, selectionEmp.role)
            })
            setTimeout(init, 200)
        })
    } catch (err){
        console.log(err)
    }
}

// function to prompt all employees and remove selected employee
async function removeEmployee(){
    option = 4; // // Set to "4" as a check to delete
    try{
        // get selected employee
        let selectedEmployee = await whichEmployee(option);  // line 128
   
        // prompt function whichEmployee using selectedEmployee
        await inquirer
        .prompt(selectedEmployee)
        .then(async function( selection ) {
            console.log(selection)
            employee.deleteEmployee(connection, selection)
        })
    setTimeout(init, 200)
    } catch (err){
        console.log(err)
    }
}