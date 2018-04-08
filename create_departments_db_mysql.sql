-- Make it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

CREATE TABLE departments (
-- item_id (unique id for each department)
	department_id integer auto_increment,
-- product_name (Name of department)
	department_name VARCHAR(500),
-- over_head_costs (cost to run the department even with 0 sales)
	over_head_costs decimal (6,2),
-- product_sales (how much of the product in each department has been sold)
	product_sales decimal (6,2),
-- Set the primary key of the table to id --
	primary key (department_id)
);

INSERT INTO departments
(department_name, over_head_costs, product_sales)
values 
('food', 1054.89, 2104.21),
('car parts', 554.89, 5104.21),
('office supplies', 354.89, 304.21)

