// Load the NPM Package mysql
var mysql = require("mysql");

// Load the NPM Package inquirer
var inquirer = require("inquirer");

// Load the npm Package CLI-table
var Table = require('cli-table');

var Inspect = require('inspect');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    supervisorView();
});

function supervisorView(){

    inquirer
        .prompt([
            // View Product Sales by Department
            // Create New Department
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"],
                name: "supervisor_choice"
            },
        ])
        .then(function (userInput) {

            switch (userInput.supervisor_choice) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;

                case "Create New Department":
                    addNewDepartment();
                    break;

                case "Exit":
                    //all done - end the connection to the DB
                    connection.end();
                    break;

                default:
                    console.log("Error in input list. Please contact your Web Admin for assistance - guldberg@sbcglobal.net")
            }
        });
};

//If a manager selects View Product Sale, the app should list the total sales by Dept and the total profit/loss
// SELECT bamazon.departments.department_id, bamazon.departments.department_name, bamazon.departments.over_head_costs,
// (SUM(bamazon.products.total_sales_dollars) - bamazon.departments.over_head_costs) AS total_profit,
// SUM(products.total_sales_dollars) AS total_sales_in_dollars FROM bamazon.products
// RIGHT JOIN bamazon.departments ON products.department_name = departments.department_name
// GROUP BY bamazon.departments.department_id;
function viewProductSales() {
    var query = connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, " +
        "(SUM(products.total_sales_dollars) - departments.over_head_costs) AS total_profit, " +
        "SUM(products.total_sales_dollars) " +
        "AS total_sales_in_dollars FROM products RIGHT JOIN departments " +
        "ON products.department_name = departments.department_name " +
        "GROUP BY departments.department_id", function (err, joinAndGroupByResponse) {
            if (err) throw err;

            printStuff(joinAndGroupByResponse);

            supervisorView();
        })
}

//Add New Product, it will allow the manager to add a completely new product to the store.
function addNewDepartment() {

    inquirer
        .prompt([
            // Here we prompt the user which song they want to add to the DB
            {
                type: "input",
                message: "What is the new department name?",
                name: "department_name"
            },
            // Here we prompt the user who sang the song that we will add to the DB
            {
                type: "input",
                message: "What is the overhead ($) for the department?",
                name: "over_head_costs"
            },
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: false
            },
        ])
        .then(function (userInput) {
            if (userInput.confirm) {
                console.log("Inserting a new department...\n");
                console.log(userInput.department_name);
                console.log(userInput.over_head_costs);

                connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: userInput.department_name,
                        over_head_costs: userInput.over_head_costs,
                        product_sales: 0.00,
                    },
                    function (err, dbRespAddDepartment) {
                        console.log(dbRespAddDepartment)
                        if (err) throw err;

                        //display the updated amount by querying the DB
                        connection.query("SELECT * FROM departments WHERE department_name='" + userInput.department_name + "'", function (err, dbRespAddDepartmentCheck) {
                            if (err) throw err;

                            printStuff(dbRespAddDepartmentCheck);

                            supervisorView();

                        });
                    }

                );
            }
        });

}

//print stuff to the screen using cli-table NPM
function printStuff(res) {
    console.log(res);
    var table = new Table({
        head: ['Item ID', 'Department', 'Over Head', 'Product Sales', 'Total profit']
        , colWidths: [10, 20, 20, 15, 15]
    });

    for (var i = 0; i < res.length; i++) {
        if (res[i].total_sales_in_dollars == undefined) {
            res[i].total_sales_in_dollars = 0;
        }
        if (res[i].total_profit == undefined) {
            res[i].total_profit = res[i].total_sales_in_dollars - res[i].over_head_costs;
        }


        table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales_in_dollars, res[i].total_profit]);
    }
    console.log(table.toString());
}