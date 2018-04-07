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

    var query = connection.query("SELECT * FROM products", function (err, dbDumpResp) {
        if (err) throw err;

        printStuff(dbDumpResp);

        inquirer
            .prompt([
                // Here we prompt the user to input what genre that song is in?
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

                //attempt to but that # of items - should prevent a race condition 
                //      where multiple users are trying to buy the same thing at once
                //  if there are enough in stock decrement the amount
                //      else return an error to the user that there aren't enough in stock
                //  
                var query1 = connection.query("UPDATE products SET stock_quantity = stock_quantity - "
                    + userInput.user_amount + " WHERE id =" + userInput.user_choice
                    + " AND stock_quantity >= " + userInput.user_amount,

                    function (err, updateSqlAttemptToBuyResponse) {
                        if (err) throw err;

                        console.log(updateSqlAttemptToBuyResponse.affectedRows);
                        console.log(query1.sql);

                        debugger;

                        // if there are 0 affected rows that means there wasn't enough in inventory
                        //  else there was enough in inventory - inform the user of the amount they owe  
                        //          (.toFixed gives 2 decimal places)  res[userInput.user_choice-1].price - -1 is for zero based numbering of array
                        if (updateSqlAttemptToBuyResponse.affectedRows == 0) {
                            console.log("Insufficient quantity!");
                        }
                        else{
                            console.log("Congrats on your purchase.");
                            console.log("You owe: $" + (userInput.user_amount* dbDumpResp[userInput.user_choice-1].price).toFixed(2));

                            // console.log(userInput.user_amount* res[userInput.user_choice-1].price);
                            // console.log(res[userInput.user_choice].price);
                        }

                        //all done - end the connection to the DB
                        connection.end();
                    }
                )

            });

    });


});


//print stuff to the screen using cli-table NPM
function printStuff(res) {
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price']
        , colWidths: [10, 45, 40, 8]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price]);
    }
    console.log(table.toString());
}