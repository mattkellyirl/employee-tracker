const inquirer = require('inquirer');

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
        type: 'list',
        name: 'menu',
        message: 'Select Option',
        choices: prompts
    }
];

function init() {
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
        .then((response) => {
        });
};

init();