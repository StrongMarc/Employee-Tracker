DROP DATABASE IF EXISTS employee_db;
-- Creates the "employee_db" database --
CREATE DATABASE employee_db;

-- Makes it so all of the following code will affect employee_db --
USE employee_db;

-- Creates the table "department" within employee_db --
CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

-- Creates the table "department" within employee_db --
CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL (7),
  department_id INTEGER(3), 
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Creates the table "department" within employee_db --
CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(10),
  manager_id INTEGER(10),
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

-- https://www.w3schools.com/sql/sql_foreignkey.asp
-- To create a FOREIGN KEY constraint on the "PersonID" column when the "Orders" table is already created, --
--  use the following SQL:
ALTER TABLE employee
ADD FOREIGN KEY (manager_id) REFERENCES employee(id) ON UPDATE CASCADE;

-- https://www.w3schools.com/sql/sql_alter.asp
ALTER TABLE employee MODIFY manager_id VARCHAR(61);
-- https://stackoverflow.com/questions/5774532/mysql-combine-two-columns-and-add-into-a-new-column
UPDATE manager_id SET combined = CONCAT(first_name, ' ', last_name);
SELECT manager_id FROM employee;
 
 -- https://www.mysqltutorial.org/mysql-self-join/
SELECT CONCAT(first_name,' ' , last_name) AS 'Manager' FROM employee INNER JOIN employee ON employee.manager_id = employee.id;
SELECT id, first_name, last_name
FROM employee
INNER JOIN employee ON employee.manager_id = employee.id;

-- table
SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id
FROM employee
INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id;

-- try
SELECT CONCAT(m.lastName, ', ', m.firstName) AS 'Manager', CONCAT(e.lastName, ', ', e.firstName) AS 'Direct report'
FROM employee e
INNER JOIN employee m ON 
    m.manager_id = e.id;


CONCAT(first_name,' ' , last_name) AS 'department' FROM employee

SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id
FROM employee
JOIN role ON employee.role_id = role.id ORDER BY employee.id;

SELECT first_name as first_name, (SELECT first_name FROM employee WHERE employee.id = manager_id) AS 'Manager' FROM employee;

SELECT employee.id, first_name, last_name, title, department_id, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id = '2' ORDER BY employee.id;