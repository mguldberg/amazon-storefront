// Load the NPM Package mysql
var mysql = require("mysql");

// Load the NPM Package inquirer
var inquirer = require("inquirer");

// Load the npm Package CLI-table
var Table = require('cli-table');

var Inspect = require('inspect');

require('console.table');

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

    //call main function - function is used to create a recursive
    //  function call in case user wants to buy more than 1 thing
    customerView();
});

//main function - customerView 
// will display to the user choice of items from the database 
// will ask user which item they want to buy and the quantity of that item to purchase
// IF there enough of the item,
//    will decrement the database of the item 
//    SET total_sales_dollars and total_sales_count
// ELSE it will inform user and not purchase the item
function customerView() {

    //query bamazon DB for all products 
    var query = connection.query("SELECT * FROM products", function (err, dbDumpResp) {
        if (err) throw err;

        // console.table(dbDumpResp);

        //print data in table form
        printStuff(dbDumpResp);

        //ask user which product they want to purchase and how many
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What product would you like? (id #)",
                    name: "user_choice"
                },
                {
                    type: "input",
                    message: "How many of them would you like to buy?",
                    name: "user_amount"
                },

            ])
            .then(function (userInput) {

                // After prompt - attempt to buy that # of items - this single query should prevent a race condition with quantity
                //      check and set in same UPDATE sql where multiple users are trying to buy the same thing at once
                //  IF there are enough in stock decrement  decrement the amount AND
                //        SET total_sales_dollars and total_sales_count
                //  ELSE return an error to the user that there aren't enough in stock
                //  
                var query1 = connection.query("UPDATE products " +
                    " SET stock_quantity = stock_quantity - " + userInput.user_amount + "," +
                    " total_sales_count = total_sales_count + " + userInput.user_amount + "," +
                    " total_sales_dollars = total_sales_dollars + " + (userInput.user_amount * dbDumpResp[userInput.user_choice - 1].price) +
                    " WHERE id =" + userInput.user_choice + " AND stock_quantity >= " + userInput.user_amount,

                    function (err, updateSqlAttemptToBuyResponse) {
                        if (err) throw err;

                        // console.log(updateSqlAttemptToBuyResponse.affectedRows);
                        // console.log(query1.sql);

                        debugger;

                        // if there are 0 affected rows that means there wasn't enough in inventory
                        //  else there was enough in inventory - inform the user of the amount they owe  
                        //          (.toFixed gives 2 decimal places)  res[userInput.user_choice-1].price - -1 is for zero based numbering of array
                        if (updateSqlAttemptToBuyResponse.affectedRows == 0) {
                            console.log("Insufficient quantity!");
                        }
                        else {
                            console.log("Congrats on your purchase.");
                            console.log("You owe: $" + (userInput.user_amount * dbDumpResp[userInput.user_choice - 1].price).toFixed(2));

                            // console.log(userInput.user_amount* res[userInput.user_choice-1].price);
                            // console.log(res[userInput.user_choice].price);
                        }

                        // Here we ask the user if they want to keep shopping or not.
                        inquirer
                            .prompt([
                                {
                                    type: "confirm",
                                    message: "Would you like to continue shopping?",
                                    name: "confirm",
                                    default: false
                                },
                            ])
                            .then(function (userInput) {
                                if (userInput.confirm) {
                                    //if yes - make recursive call to customerView() so user can continue shopping
                                    customerView();
                                }
                                else {
                                    //all done - end the connection to the DB
                                    connection.end();
                                }
                            })
                    });
            });
    });
}

//print stuff to the screen using cli-table NPM
function printStuff(res) {
    // console.log(res);
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price']
        , colWidths: [10, 45, 40, 10]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2)]);
    }
    console.log(table.toString());
}