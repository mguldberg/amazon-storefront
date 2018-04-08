SELECT * FROM bamazon.products;

SELECT bamazon.departments.department_name, SUM(products.total_sales_dollars) AS total_sales_in_dollars FROM bamazon.products
RIGHT JOIN bamazon.departments ON products.department_name = departments.department_name
GROUP BY bamazon.departments.department_name;