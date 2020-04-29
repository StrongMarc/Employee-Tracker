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

SELECT employee.id, employee.first_name, employee.last_name, title, department.name AS 'department', salary, CONCAT(manager.first_name,' ' , manager.last_name) AS 'manager' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department_id = "1" ORDER BY employee.id

 












