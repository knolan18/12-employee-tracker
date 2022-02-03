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
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
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

  function viewAllDepartments() {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, res) => {
      if(err) res.status(500).json({error: err.message});
      console.table(res);
      whatAction();
    })
  };

  function viewAllRoles() {
    const sql = 'SELECT * FROM role';
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
    .then( res => {
      let deptName = res.deptName;
      let newDepartment = deptName;

      db.query('INSERT INTO department SET department_name= ?', newDepartment,(err, res) => {
        if(err){
          console.log(err);
        }
        const departments = res.map(({ id, department_name}) => ({
          name: `${deptName}`,
          value: id
        }))
        console.log(`${deptName} added to database!`);
        viewAllDepartments();
      })
    })
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

     