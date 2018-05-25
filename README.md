# Node.js based amazon-storefront application

## About
This is Node.js CLI application where a user can be a...
* Buyer/Customer
* manager - monitors store stock
* director - manages store profitability, new items, and new departments

## Motivation
Create an application that allows for users to buy items and store all of this information in a database.

## Git Hub Link 
https://github.com/mguldberg/amazon-storefront

## Technologies Used
Node.js, Javascript, MySQL

## License 
MIT License

### Notes on structure of the files in this repository
- bamazonCustomer.js
  * will display database of items that user can purchase
  * user can only purchase item if there is sufficient stock
  * will update DB with number purchased, value of the sales, decrement the stock quantity
  * *Note*: used single sql query to minimize the chance of race condition of querying DB for stock quantity and then trying to decrement the stock number  - only could happen if there are multiple users

- bamazonManager.js
  * will display database of items and the current stock and sales of each item
  * will display low inventory (stock < 5)
  * will allow for adding stock to an existing item
  * will allow to add new item to the DB
  
  
- bamazonSupervisor.js
  * will display sales by department and if there was profit or loss 
    * uses JOIN, GROUPBY, and alias column that dynamically calculates the profit or loss
  * allows user to add a department


####Other Functionality: 
  * All .js allow user to stay in the program to choose to do tasks over and over again until they are ready to Exit by leveraging recursive function calls to do this.
  * Allow a gracefully exit from all programs
  * Format the columns better to show $ and cents.
  * Dynamically updates the departments list (used in bamazonManager.js ) when adding a department to the DB via bamazonSupervisor.js
