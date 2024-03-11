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

        case 'addNewRole':
            console.log('OK');
            promptUser();
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

        case 'addNewDepartment':
            console.log('OK');
            promptUser();
            break;

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