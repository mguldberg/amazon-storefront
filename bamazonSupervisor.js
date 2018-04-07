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

    inquirer
        .prompt([
            // View Products for Sale
            // View Low Inventory
            // Add to Inventory
            // Add New Product
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

                case "Quit":
                    //all done - end the connection to the DB
                    connection.end();
                    break;

                default:
                    console.log("Error in input list. Please contact your Web Admin for assistance - guldberg@sbcglobal.net.")
            }

        });


});

//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProductsForSale() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        printStuff(res);
    })
}

//If a manager selects View Low Inventory, then it will list all products with an inventory count lower than 5.
function viewLowInventory() {
    var query = connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // console.log("query low inventory -----------------------------");
        printStuff(res);
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

                        printStuff(dbRespAddInvCheck);
                    });
                });
            });
    });
}

function bidItem() {

    // var rawDumpOfItems = readAndDisplayDb();
    // console.log ("raw" + rawDumpOfItems);
    var returnValue = [];
    connection.query("SELECT * FROM items", function (err, res) {

        printStuff(res);

        var arrayOfItems = [];

        for (i = 0; i < res.length; i++) {
            arrayOfItems.push(res[i].id + " | " + res[i].item_name);
        }

        // console.log(arrayOfItems);
        inquirer
            .prompt([

                // Here we prompt the user to input what genre that song is in?
                {
                    type: "list",
                    message: "What item do you want to bid on",
                    choices: arrayOfItems,
                    name: "item_selection"
                },


            ])
            .then(function (userInput) {
                console.log(userInput.item_selection);

                inquirer
                    .prompt([

                        // Here we prompt the user to input what genre that song is in?
                        {
                            type: "list",
                            message: "What item do you want to bid on",
                            choices: arrayOfItems,
                            name: "item_selection"
                        },


                    ])
                    .then(function (userInput) {
                        console.log(userInput.item_selection);



                    });

            });



    });


}

function postItem() {

    inquirer
        .prompt([
            // Here we prompt the user which song they want to add to the DB
            {
                type: "input",
                message: "What  the item name?",
                name: "item_name"
            },
            // Here we prompt the user who sang the song that we will add to the DB
            {
                type: "input",
                message: "What is the minimum value of the item?",
                name: "min_value"
            },
            // Here we prompt the user to input what genre that song is in?
            {
                type: "list",
                message: "What category is your item?",
                choices: ["Appliance", "Household", "Sporting Goods", "Other"],
                name: "category"
            },
            {
                type: "list",
                message: "What condition is your item in?",
                choices: ["Lightly Used", "Used", "New"],
                name: "item_condition"
            },
            // Here we prompt the user who sang the song that we will add to the DB
            {
                type: "input",
                message: "What is the long description of your item?",
                name: "description"
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

                writeDataToMySql(userInput.item_name, userInput.min_value, userInput.category, userInput.item_condition, userInput.description);
            }
        });

}

function readAndDisplayDb() {
    var returnValue = [];
    connection.query("SELECT * FROM items", function (err, res) {
        printStuff(res);
        // console.log(res);

        return res;
    });
    // return returnValue;
}

// function queryDanceSongs() {
//     var query = connection.query("SELECT * FROM songs WHERE genre='Classic Rock' OR genre='Dance'", function (err, res) {
//         console.log("query specifc genre: -----------------------------");

//         for (i = 0; i < res.length; i++) {
//             console.log(res[i].title + " ::" + res[i].artist);

//         }


//         console.log(query.sql);

//     });

//     // logs the actual query being run
// }



function printStuff(res) {
    console.log(res);
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock Inventory']
        , colWidths: [10, 45, 40, 8, 15]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
}





//Add New Product, it will allow the manager to add a completely new product to the store.
function addNewProduct() {

    inquirer
        .prompt([
            // Here we prompt the user which song they want to add to the DB
            {
                type: "input",
                message: "What is the product name?",
                name: "product_name"
            },
            // Here we prompt the user who sang the song that we will add to the DB
            {
                type: "input",
                message: "What is the unit price of the product?",
                name: "price"
            },
            // Here we prompt the user to input what genre that song is in?
            {
                type: "list",
                message: "What department does this product belong to?",
                choices: ["food", "car parts", "office supplies", "Other"],
                name: "department_name"
            },
            // Here we prompt the user who sang the song that we will add to the DB
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
                console.log("Inserting a new item...\n");
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
                        connection.query("SELECT * FROM products where id=" + userInput.product_id, function (err, dbRespAddProductCheck) {
                            if (err) throw err;

                            printStuff(dbRespAddProductCheck);
                        });
                    }

                );
            }
        });

}
