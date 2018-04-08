-- Drops the favorite_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Make it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

CREATE TABLE products (
-- item_id (unique id for each product)
	id integer auto_increment,
-- product_name (Name of product)
	product_name VARCHAR(500),
-- department_name
	department_name VARCHAR(500),
-- price (cost to customer)
	price decimal (5,2),
-- stock_quantity (how much of the product is available in stores)
	stock_quantity integer(10),
-- Set the primary key of the table to id --
	primary key (id)
);

INSERT INTO products
(product_name, department_name, price, stock_quantity)
values 
('pop tarts', 'food', 3.21, 2000),
('bananas', 'food', 3.21, 2000),
('turtles', 'food', 2.45, 2000),
('brisket', 'food', 3.21, 2000),
('wipers', 'car parts', 3.21, 2000),
('cheerios', 'food', 3.21, 2000),
('tape', 'office supplies', 234.21, 2000),
('staples', 'office supplies', 4.25, 2000),
('tires', 'car parts', 144.50, 2000),
('coffee', 'food', 1.45, 2000);


ALTER TABLE products DROP COLUMN total_sales;
ALTER TABLE products ADD total_sales_dollars decimal (6,2) DEFAULT 0.00;
ALTER TABLE products ADD total_sales_count integer (7) DEFAULT 0;

