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

        case 'addNewEmployee':
            console.log('OK');
            promptUser();
            break;

        case 'updateEmployeeRole':
            console.log('OK');
            promptUser();
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
            });
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
                    }
            
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
                                console.log(`New role "${title}" added successfully!`);
                                promptUser();
                            }
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
                            console.log(`New department "${departmentName}" added successfully!`);
                            promptUser();
                        }
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