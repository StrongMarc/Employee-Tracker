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
    .then((selection) => {
        console.log(selection.select)
        switch (selection.select) {

            case "View All Employees":
              console.log("hi")
              employee.getAllEmployees(connection)
              break;
            
            // case "Engineer":
            //   data = data.replace("%github", role.github)
            //   return data;
            //   break;
            
            // case "Intern":
            //   data = data.replace("%school", role.school)
            //   return data;
            //   break;
        }
    })
}