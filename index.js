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
}


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

