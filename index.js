const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'mclaren',
        database: 'mclaren_f1_team_db'
    });

db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('Connected to MySQL');
        init();
    }
});

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

const menu = [
    {
        name: 'menu',
        type: 'list',
        message: 'Select Option',
        choices: prompts
    }
];

const userResponse = (response) => {
    const userRes = response.menu;
    switch (userRes) {
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
                    // init();
                };
            });            
            break;
        case 'addNewEmployee':
            console.log('OK');
            break;
        case 'updateEmployeeRole':
            console.log('OK');
            break;
        case 'viewAllRoles':
            console.log('OK');
            break;
        case 'addNewRole':
            console.log('OK');
            break;
        case 'viewAllDepartments':
            console.log('OK');
            break;
        case 'addNewDepartment':
            console.log('OK');
            break;
        case 'exit':
            console.log('OK');
            process.exit();
        default: 
            console.log('Invalid Option')
    };
};

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
    inquirer.prompt(menu)
        .then(userResponse);
};