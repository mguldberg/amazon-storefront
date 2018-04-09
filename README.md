# amazon-storefront
amazon storefront homework

bamazonCustomer.js
  * will display database of items that user can purchase
  * user can only purchase item if there is sufficient stock
  * will update DB with number purchased, value of the sales, decrement the stock quantity

  * *Bonus*: used single sql query to minimize the chance of race condition of querying DB for stock quantity and then trying to decrement the stock number  - only could happen if there are multiple users

bamazonManager.js
  * will display database of items and the current stock and sales of each item
  * will display low inventory (stock < 5)
  * will allow for adding stock to an existing item
  * will allow to add new item to the DB
  
  
bamazonSupervisor.js
  * will display sales by department and if there was profit or loss 
    * uses JOIN, GROUPBY, and alias column that dynamically calculates the profit or loss
  * allows user to add a department

BONUS: 
- All .js allow user to stay in the program to choose to do tasks over and over again until they are ready to Exit.
- Leverages recursive calls to do this.
- Allow customer to exit gracefully from program, format the columns better to show $.
- Dynamically updates the departments list (used in bamazonManager.js ) when adding a department to the DB via bamazonSupervisor.js
