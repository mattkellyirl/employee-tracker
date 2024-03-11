const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create mysql connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'mclaren',
        database: 'mclaren_f1_team_db'
    });

// Error handling for mysql connection
db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('Connected to McLaren F1 Team Database');
        init();
        promptUser();
    }
});

// Prompts
const prompts = [
    { name: 'View All Employees', value: 'viewAllEmployees'},
    { name: 'Add New Employee', value: 'addNewEmployee'},
    { name: 'Update Employee Role', value: 'updateEmployeeRole'},
    { name: 'View All Roles', value: 'viewAllRoles'},
    { name: 'Add New Role', value: 'addNewRole'},
    { name: 'View All Departments', value: 'viewAllDepartments'},
    { name: 'Add New Department', value: 'addNewDepartment'},
    { name: 'Exit', value: 'exit'},
];

// Menu which displays prompt selection to user
const menu = [
    {
        name: 'menu',
        type: 'list',
        message: 'Select Option',
        choices: prompts
    }
];

// Display database information based on user response from prompt menu
const userResponse = (response) => {
    const userRes = response.menu;
    switch (userRes) {

        // View all employees
        case 'viewAllEmployees':
            db.query(`
            SELECT employee.id, 
                   employee.first_name, 
                   employee.last_name, 
                   role.title, 
                   department.name as department,
                   role.salary
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
        `, (error, results, fields) => {
                if (error) {
                    console.error('Error Fetching Data', error);
                } else {
                    console.table(results);
                    promptUser();
                };
            });            
            break;

        // Add new employee
        case 'addNewEmployee':
            const addEmployee = () => {
                // Fetch roles from the database
                db.query('SELECT id, title FROM role', (error, roles) => {
                    if (error) {
                        console.error('Error Fetching Roles', error);
                        promptUser();
                        return;
                    };
        
                    inquirer.prompt([
                        {
                            name: 'firstName',
                            type: 'input',
                            message: 'Enter Employee\'s First Name:',

                            // Validate that name is not empty and return error if necessary
                            validate: (input) => {
                                if (input.trim() !== '') {
                                    return true;
                                } else {
                                    return 'Please enter a valid first name'
                                };
                            }
                        },
                        {
                            name: 'lastName',
                            type: 'input',
                            message: 'Enter Employee\'s Last Name:',
                            validate: (input) => {
                                return input.trim() !== '' ? true : 'Please enter a valid last name';
                            }
                        },
                        {
                            name: 'role',
                            type: 'list',
                            message: 'Select Employee\'s Role:',
                            choices: roles.map((role) => ({ name: role.title, value: role.id })),
                        },
                    ]).then((answers) => {
                        const { firstName, lastName, role } = answers;
        
                        // Insert new employee into database
                        db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [firstName, lastName, role], (error, results, fields) => {
                            if (error) {
                                console.error('Error adding new employee', error);
                                addEmployee(); // Prompt the user again in case of error
                            } else {
                                console.log(`New employee "${firstName} ${lastName}" added successfully`);
                                promptUser();
                            };
                        });
                    });
                });
            };
        
            addEmployee();
            break;

        // Update employee role
        case 'updateEmployeeRole':
            const updateEmployeeRole = () => {
                // Fetch employees and roles from database
                db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, employees) => {
                    if (error) {
                        console.error('Error Fetching Employees', error);
                        promptUser();
                        return;
                    };
        
                    db.query('SELECT id, title FROM role', (error, roles) => {
                        if (error) {
                            console.error('Error Fetching Roles', error);
                            promptUser();
                            return;
                        };
        
                        inquirer.prompt([
                            {
                                name: 'employee',
                                type: 'list',
                                message: 'Select Employee to Update:',
                                choices: employees.map((employee) => ({ name: employee.name, value: employee.id })),
                            },
                            {
                                name: 'role',
                                type: 'list',
                                message: 'Select New Role:',
                                choices: roles.map((role) => ({ name: role.title, value: role.id })),
                            },
                        ]).then((answers) => {
                            const { employee, role } = answers;
        
                            // Update the employees role in the database
                            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role, employee], (error, results, fields) => {
                                if (error) {
                                    console.error('Error updating employee role', error);
                                    updateEmployeeRole(); // Prompt the user again in case of an error
                                } else {
                                    console.log('Employee role updated successfully');
                                    promptUser();
                                };
                            });
                        });
                    });
                });
            };
        
            updateEmployeeRole();
            break;

        // View all roles
        case 'viewAllRoles':
            db.query(`
            SELECT role.id,
                   role.title,
                   department.name as department,
                   role.salary
            FROM role
            JOIN department ON role.department_id = department.id
        `, (error, results, fields) => {
                if (error) {
                    console.error('Error Fetching Data', error);
                } else {
                    console.table(results);
                    promptUser();
                    };
                }
            );
            break;

        // Add new role
        case 'addNewRole':
            const addRole = () => {
                // Fetch departments from database
                db.query('SELECT id, name FROM department', (error, departments) => {
                    if (error) {
                        console.error('Error Fetching Departments', error);
                        promptUser();
                        return;
                    };
            
                    inquirer.prompt([
                        {
                            name: 'title',
                            type: 'input',
                            message: 'Enter Role:',

                            // Validate that role is not empty and return error if necessary
                            validate: (input) => {
                                if (input.trim() !== '') {
                                    return true;
                                } else {
                                    return 'Please enter a valid role'
                                };
                            }
                        },
                        {
                            name: 'salary',
                            type: 'input',
                            message: 'Enter Salary:',

                            // Validate that salary is not empty, is a number and returns error if necessary
                            validate: (input) => {
                                    const trimmedInput = input.trim();
                                if (trimmedInput !== '' && !isNaN(trimmedInput)) {
                                    return true;
                                } else {
                                    return 'Please enter a valid salary'
                                };
                            }
                        },
                        {
                            name: 'department',
                            type: 'list',
                            message: 'Select Department:',
                            choices: departments.map((department) => ({ name: department.name, value: department.id })),
                        },
                    ]).then((answers) => {
                        const { title, salary, department } = answers;
            
                        // Insert the new role into the database
                        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department], (error, results, fields) => {
                            if (error) {
                                console.error('Error adding new role', error);
                                addRole(); // Prompt the user again in case of error
                            } else {
                                console.log(`New role "${title}" added successfully`);
                                promptUser();
                            };
                        });
                    });
                });
            };
        
            addRole();
            break;

        // View all departments
        case 'viewAllDepartments':
            db.query(`
            SELECT id,
                   name as department
            FROM department
        `, (error, results, fields) => {
                if (error) {
                    console.error('Error Fetching Data', error);
                } else {
                    console.table(results);
                    promptUser();
                    };
            });
            break;

        // Add new department
        case 'addNewDepartment':
            const addDepartment = () => {
                inquirer.prompt([
                    {
                        name: 'departmentName',
                        type: 'input',
                        message: 'Enter Department Name:',
                    
                        // Validate that department name is not empty and return error if necessary
                        validate: (input) => {
                            if (input.trim() !== '') {
                                return true;
                            } else {
                                return 'Please enter a valid department name'
                            };
                        }
                    },
                ]).then((answers) => {
                    const departmentName = answers.departmentName;
            
                    // Insert the new department into the database
                    db.query('INSERT INTO department (name) VALUES (?)', [departmentName], (error, results, fields) => {
                        if (error) {
                            console.error('Error adding new department', error);
                            addDepartment(); // Prompt the user again in case of error
                        } else {
                            console.log(`New department "${departmentName}" added successfully`);
                            promptUser();
                        };
                    });
                });
            };

            addDepartment();
            break;

        // Exit application
        case 'exit':
            console.log('Disconnected from McLaren F1 Team Database');
            process.exit();
        default: 
            console.log('Invalid Option')
    };
};
// Initialise application 
const init = () => {
    console.log(`  


            ███╗   ███╗ ██████╗██╗      █████╗ ██████╗ ███████╗███╗   ██╗    ███████╗ ██╗                
            ████╗ ████║██╔════╝██║     ██╔══██╗██╔══██╗██╔════╝████╗  ██║    ██╔════╝███║                
            ██╔████╔██║██║     ██║     ███████║██████╔╝█████╗  ██╔██╗ ██║    █████╗  ╚██║                
            ██║╚██╔╝██║██║     ██║     ██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║    ██╔══╝   ██║                
            ██║ ╚═╝ ██║╚██████╗███████╗██║  ██║██║  ██║███████╗██║ ╚████║    ██║      ██║                
            ╚═╝     ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝    ╚═╝      ╚═╝                
                                                                                                         
████████╗███████╗ █████╗ ███╗   ███╗    ██████╗  █████╗ ████████╗ █████╗ ██████╗  █████╗ ███████╗███████╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝
   ██║   █████╗  ███████║██╔████╔██║    ██║  ██║███████║   ██║   ███████║██████╔╝███████║███████╗█████╗  
   ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║    ██║  ██║██╔══██║   ██║   ██╔══██║██╔══██╗██╔══██║╚════██║██╔══╝  
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║    ██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝██║  ██║███████║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
   

   `)
};

// Prompt options to user from menu
const promptUser = () => {
    inquirer.prompt(menu)
        .then(userResponse);
};