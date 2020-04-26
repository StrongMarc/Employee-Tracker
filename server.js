// add npm packagmssql and inquirer
const mysql = require("mysql");
const inquirer = require("inquirer")

// add developer modules
const employee = require('./queries/employee')

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,  // mySQL must use 3306
  
    // Your username
    user: 'root',
  
    // Your password
    password: 'password',
    database: 'employee_db'
  });

  // prompt to do menu
const toDoMenu = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "select",
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
    
    // prompt todo menu
    inquirer
    .prompt(toDoMenu)
    .then(function( response ) {
        console.log(response)
    })
        
});

// function init() {
//     inquirer
//     .prompt(toDoMenu)
//     .then(function( response ) {
//         console.log(response)
//     });
// }