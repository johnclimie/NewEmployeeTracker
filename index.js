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
                case 'Add a department':
                    addDep();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmp();
                    break;
                case 'Update an employee':
                    updateEmp();
                    break;
            }
        })
}

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
            .query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id', function(err, results) {
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
    
    // Adds all roles to an array
    connection
        .query('SELECT title FROM role', function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results.forEach(role => roleArr.push(role.title))
            }
        })
    
    // Adds all managers to an array
    connection 
        .query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                results.forEach(names => managerArr.push(`${names.first_name} ${names.last_name}`));
                managerArr.push("No manager");
            }
        })


// Add Functions

    // Adds new department

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
                    .query(`INSERT INTO department (name) VALUES ("${response.depName}")`, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Success');
                            console.log('\n')
                            start();
                        }
                    })
            })
    }

    // Adds new role
    const addRole = () => {
        inquirer
            .prompt([
                {
                    name:'roleName',
                    message: 'What is the name of the role you are adding?',
                    type: 'input'
                },
                {
                    name: 'roleSalary',
                    message: 'What is this roles salary?',
                    type: 'input'
                },
                {
                    name: 'roleDepartment',
                    message: `What is this role's department?`,
                    type: 'list',
                    choices: departmentArr
                }

            ])
            .then((response) => {
                connection
                    .query('SELECT * FROM department', function(err, results) {
                        let depId;
                        if (err) {
                            console.log(err);
                        } else {
                            for (i = 0; i < results.length; i++) {
                                if (response.roleDepartment === results[i].name) {
                                    depId = results[i].id;
                                }
                            };

                            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.roleName}", ${response.roleSalary}, ${depId})`, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Success');
                                    console.log('\n')
                                    start();
                                }
                            })
                        }
                    })
            })
    }

    // Adds a new employee
        const addEmp = () => {
            inquirer
                .prompt([
                    {
                        name:'empfName',
                        message:'What is the first name of this employee?',
                        type: 'input'
                    },
                    {
                        name:'emplName',
                        message:'What is the last name of this employee?',
                        type: 'input',  
                    },
                    {
                        name:'empRole',
                        message: 'What is the role of this employee?',
                        type:'list',
                        choices: roleArr
                    },
                    {
                        name:'empManager',
                        message:`Who is this employee's manager?`,
                        type:'list',
                        choices: managerArr
                    }
                ])
                .then((response) => {
                    connection
                        .query('SELECT * FROM role', function(err, results) {
                            let roleId;
                            if (err) {
                                console.log(err);
                            } else {
                                for (i = 0; i < results.length; i++) {
                                    if (response.empRole === results[i].title) {
                                        roleId = results[i].id;
                                    }
                                }

                                connection
                                    .query('SELECT * FROM employee WHERE manager_id IS NULL', function(err, results) {
                                        let managerId;
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            if (response.empManager === "No manager") {
                                                managerId = null;
                                            } else {
                                                for (var i = 0; i < results.length; i++) {
                                                    if (response.empManager === `${results[i].first_name} ${results[i].last_name}`) {
                                                        managerId = results[i].id;
                                                    }
                                                }
                                            }
                                        }

                                        connection 
                                            .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.empfName}", "${response.emplName}", ${roleId}, ${managerId})`), function(err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            }
                                    })
                            }
                            console.log("Success");
                            console.log('\n')
                            start();
                        })
                })
        }

// Update employee function
const updateEmp = () => {
    let empArr = [];
    connection
        .query('SELECT * FROM employee', function(err, results) {
            if(err) {
                console.log(err);
            } else {
                results.forEach(names => empArr.push(`${names.first_name} ${names.last_name}`));
            }

            inquirer
                .prompt([
                    {
                        name: 'empName',
                        message: 'Which employee would you like to update?',
                        type: 'list',
                        choices: empArr
                    },
                    {
                        name: 'newRole',
                        message: `What is the employee's new role?`,
                        type: 'list', 
                        choices: roleArr
                    }
                ])
                .then((response) => {
                    connection
                        .query('SELECT * FROM role', function(err, results) {
                            if (err) {
                                console.log(err)
                            } else {
                                let upRole;
                                for (i = 0; i < results.length; i++) {
                                    if (results[i].title === response.newRole) {
                                        upRole = results[i].id;
                                    }
                                }

                                connection
                                    .query('SELECT * FROM employee', function(err, results) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            let upEmp;
                                            for (i = 0; i < results.length; i++) {
                                                if (`${results[i].first_name} ${results[i].last_name}` === response.empName) {
                                                    upEmp = results[i].id;
                                                }
                                            }


                                            connection
                                                .query(`UPDATE employee SET role_id = ${upRole} WHERE id = ${upEmp}`, function(err, results) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log("Success");
                                                        console.log('\n')
                                                        start();
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                })
        })
}


// Invokes initial prompt
start();