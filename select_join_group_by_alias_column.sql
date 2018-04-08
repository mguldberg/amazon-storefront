SELECT * FROM bamazon.departments;

SELECT bamazon.departments.department_id,
(bamazon.products.total_sales_count - bamazon.departments.over_head_costs) AS total_profit;

SELECT bamazon.departments.department_id, bamazon.departments.department_name, bamazon.departments.over_head_costs,
(SUM(bamazon.products.total_sales_dollars) - bamazon.departments.over_head_costs) AS total_profit,
SUM(products.total_sales_dollars) AS total_sales_in_dollars FROM bamazon.products
RIGHT JOIN bamazon.departments ON products.department_name = departments.department_name
GROUP BY bamazon.departments.department_id;