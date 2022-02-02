const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./server');
require('console.table')

function start() {
 
  function whatAction() {
    inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"]
      }
    ]).then(res => {
      switch(res.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
      }
    })
  };
  
  function viewAllEmployees() {
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, res) => {
      if(err) res.status(500).json({error: err.message});
      console.table(res);
      whatAction();
    })
  };

  function addDepartment() {
    inquirer.prompt([
      {
        input: 'text',
        name: 'deptName',
        message: 'What is the name of the department?'
      }
    ])
  };

  function addRole() {
    inquirer.prompt([
      {
        input: 'list',
        name: 'roleType',
        message: 'What is the name of the role?',
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
      },
      {
        input: 'text',
        name: 'salaryAmt',
        message: 'What is the salary of the role?'
      },
      {
        input: 'list',
        name: 'whichDept',
        message: 'Which department does the role belong to?',
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
      }
    ])
  };

  function addEmployee() {
    inquirer.prompt([
      {
        input: 'text', 
        name: 'firstName',
        message: "What is the employee's first name?"
      },
      {
        type: 'text', 
        name: 'lastName',
        message: "What is the employee's last name?"
      }
    ])
    .then( res => {
      let firstName = res.firstName;
      let lastName = res.lastName;
      let sql2 = 'SELECT * FROM role';

      db.query(sql2, (err, res) => {
        if(err) res.status(500).json({error: err.message});
        const roles = res.map(({ id, title}) => ({
          name: `${title}`,
          value: id
        }))
        
        inquirer.prompt([
          {
            type: 'list',
            name: 'employeeRole', 
            message: "What is the employee's role?",
            choices: roles
          }
        ]).then(res => {
          let roleId = res.employeeRole;
          let sql2 = `SELECT * FROM employee`;

          db.query(sql2, (err, res) => {
            if(err) res.status(500).json({error: err.message});
            console.table(res)
            const managersArr = res.map(({id, first_name, last_name}) => ({
              name: `${first_name} ${last_name}`,
              value: id
            }))

            inquirer.prompt([
              {
                type: 'list',
                name: 'employeeManager',
                message: "Who is the employee's manager?",
                choices: managersArr
              }
            ])
            .then(res => {
              let newEmployee = {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: res.employeeManager
              };

              db.query('INSERT INTO employee SET ?', newEmployee, (err, res) => {
                if(err) res.status(500).json({error: err.message});
                console.log(`${firstName} ${lastName} added to database!`)
                viewAllEmployees();
              })
            })
          })
        })
      })
    })
  };

  whatAction();
};

start();

     