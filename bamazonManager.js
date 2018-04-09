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
    managerView();
});


function managerView() {

    inquirer
        .prompt([
            // View Products for Sale
            // View Low Inventory
            // Add to Inventory
            // Add New Product
            // Exit
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "manager_choice"
            },
        ])
        .then(function (userInput) {
            switch (userInput.manager_choice) {
                case "View Products for Sale":
                    viewProductsForSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "Exit":
                    //all done - end the connection to the DB
                    connection.end();
                    break;

                default:
                    console.log("Error in input list. Please contact your Web Admin for assistance - guldberg@sbcglobal.net")
                    connection.end();
            }
        });

}

//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProductsForSale() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        printStuff(res);

        //make recursive function call to start at main menu again
        managerView();
    })
}

//If a manager selects View Low Inventory, then it will list all products with an inventory count lower than 5.
function viewLowInventory() {
    var query = connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // console.log("query low inventory -----------------------------");
        printStuff(res);

        //make recursive function call to start at main menu again
        managerView();

    });
}

//If a manager selects Add to Inventory, app will display a prompt that will let the manager "add more" of any item currently in the store.
function addToInventory() {
    connection.query("SELECT * FROM products", function (err, dbDumpRespAddInv) {
        if (err) throw err;

        printStuff(dbDumpRespAddInv);

        inquirer
            .prompt([

                // Here we prompt the user to input what genre that song is in?
                {
                    type: "input",
                    message: "What product do you want to add inventory to?",
                    name: "product_id"
                },
                // Here we prompt the user to input the # of stock to add?
                {
                    type: "input",
                    message: "How many do you want to add to your stock count?",
                    name: "number_of_products_to_add"
                },

            ])
            .then(function (userInput) {
                console.log(userInput.product_id);

                connection.query("UPDATE products SET stock_quantity = stock_quantity + " + userInput.number_of_products_to_add + " where id=" + userInput.product_id, function (err, dbRespAddInv) {
                    if (err) throw err;

                    //display the updated amount by querying the DB
                    connection.query("SELECT * FROM products where id=" + userInput.product_id, function (err, dbRespAddInvCheck) {
                        if (err) throw err;

                        //display recent added product count to inventory/stock
                        printStuff(dbRespAddInvCheck);

                        //make recursive function call to start at main menu again
                        managerView();
                    });
                });
            });
    });
}


//Add New Product, it will allow the manager to add a completely new product to the store.
function addNewProduct() {

    connection.query("SELECT * FROM departments", function (err, res) {
       
        // console.log(res);
        
        var arrayOfDepartments = [];

        for (i = 0; i < res.length; i++) {
            arrayOfDepartments.push(res[i].department_name);
        }
        inquirer
            .prompt([
                // Here we prompt the manager to input the product name
                {
                    type: "input",
                    message: "What is the product name?",
                    name: "product_name"
                },
                // Prompt for price of product
                {
                    type: "input",
                    message: "What is the unit price of the product?",
                    name: "price"
                },
                // Here we prompt the user to input which dept it belongs to
                {
                    type: "list",
                    message: "What department does this product belong to?",
                    choices: arrayOfDepartments,
                    name: "department_name"
                },
                // Here was ask for th quantity of the products to add to the stock_quantity
                {
                    type: "input",
                    message: "What is quantity of products you want to add?",
                    name: "stock_quantity"
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
                    console.log("Inserting a new product...\n");

                    //SQL to add new product to the DB
                    connection.query(
                        "INSERT INTO products SET ?",
                        {
                            product_name: userInput.product_name,
                            department_name: userInput.department_name,
                            price: userInput.price,
                            stock_quantity: userInput.stock_quantity
                        },
                        function (err, dbRespAddProductCheck) {
                            if (err) throw err;

                            //display the updated amount by querying the DB
                            connection.query("SELECT * FROM products where product_name='" + userInput.product_name + "'", function (err, dbRespAddProductCheck) {
                                if (err) throw err;

                                //display added Product
                                printStuff(dbRespAddProductCheck);

                                //make recursive function call to start at main menu again
                                managerView();
                            });
                        }

                    );
                }
            });

    });
}

// generic function that prints things leveraging cli-table
function printStuff(res) {
    // console.log(res);
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock Inventory', 'Total Sales ($)', 'Total Sales (#)']
        , colWidths: [10, 30, 25, 10, 15, 18, 18]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].product_name, res[i].department_name, "$"+res[i].price.toFixed(2), res[i].stock_quantity, "$"+res[i].total_sales_dollars.toFixed(2), res[i].total_sales_count]);
    }
    console.log(table.toString());
}
