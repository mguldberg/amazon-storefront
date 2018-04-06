// Load the NPM Package mysql
var mysql = require("mysql");

// Load the NPM Package inquirer
var inquirer = require("inquirer");

// Load the npm Package CLI-table
var Table = require('cli-table');

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

    connection.query("SELECT * FROM products", function (err, res) {

        printStuff(res);

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

                var query = connection.query(
                    "SELECT * FROM products where id=" + userInput.user_choice,

                    function (err, res) {
                        console.log(res);

                        if (res[0].stock_quantity < userInput.user_amount) {
                            console.log("Insufficient quantity!");
                        }
                        else {

                            var query1 = connection.query("UPDATE products SET stock_quantity = stock_quantity - "
                                + userInput.user_amount + " WHERE id =" + userInput.user_choice + " and stock_quantity > 0",

                                function (err, res) {
                                    console.log(res);

                                }



                            );

                        }

                    })

            });

    });
});

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


function writeDataToMySql(item_name, min_value, category, item_condition, description) {

    console.log("Inserting a new item...\n");
    var query = connection.query(
        "INSERT INTO items SET ?",
        {
            item_name: item_name,
            min_value: min_value,
            category: category,
            item_condition: item_condition,
            description: description
        },
        function (err, res) {
            console.log(res);
            // console.log(res.affectedRows + " product inserted!\n");
            // Call updateProduct AFTER the INSERT completes
            // updateProduct();

            // console.log("-----------------------------");

        }

    );
    // logs the actual query being run
    console.log(query.sql);

}


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