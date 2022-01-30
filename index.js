// Required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Creates SQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker_db'
});

// Initial prompt questions
const start = () => {
    inquirer
        .prompt([
            {
                name:'start',
                message: 'What would you like to do?',
                type: 'list',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
            }
        ])
        .then((response) => {
            switch (response.start) {
                case 'View all departments':
                    viewDep();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmps();
                    break;
            }
        })
}

// Invokes starter prompt
// start();

// Display functions

    // Displays department table
    const viewDep = () => {
        connection 
            .query('SELECT * FROM department', function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                    console.log('\n')
                    start();
                }
            })
    }

    // Displays roles table
    const viewRoles = () => {
        connection 
            .query('SELECT * FROM role', function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                    console.log('\n')
                    start();
                }
            })
    }

    // Displays employee table
    const viewEmps = () => {
        connection 
            .query('SELECT * FROM employee', function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                    console.log('\n')
                    start();
                }
            })
    }

// Creates arrays with table data

    let departmentArr = [];
    let roleArr = [];
    let managerArr = [];

    // Adds all departments to an array
    connection
        .query('SELECT name FROM department', function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results.forEach(department => departmentArr.push(department.name))
            }
        });
    
    //Adds all roles to an array
    connection
        .query('SELECT title FROM role', function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results.forEach(role => roleArr.push(role.title))
            }
        })
        
    connection 
        .query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results.forEach(names => managerArr.push(`${names.first_name} ${names.last_name}`));
            }
        })

// Add Functions

    const addDep = () => {
        inquirer
            .prompt([
                {
                    name:'depName',
                    message: 'What is the name of the department you are adding?',
                    type: 'input'
                }
            ])
            .then((response) => {
                connection
                    .query(`INSERT INTO department (name) VALUES ("${response.depName}")`, function(err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('success');
                        }
                    })
            })
    }

