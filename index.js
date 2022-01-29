// Required packages
const inquierer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Creates SQL connection

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker_db'
});

