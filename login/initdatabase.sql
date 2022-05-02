DROP DATABASE IF EXISTS cs425project;
CREATE DATABASE IF NOT EXISTS `cs425project` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `cs425project`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20),
  `contract_id` int,
  address_line1 varchar(255),
  address_line2 varchar(255),
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS products(
	product_id int not null AUTO_INCREMENT,
    price int not null,
	product_type VARCHAR(255),
    product_name VARCHAR(255),
    manufacturer VARCHAR(255),
    product_description VARCHAR(1000),
    primary key(product_id)
);

CREATE TABLE IF NOT EXISTS orders (
	order_id INTEGER NOT NULL AUTO_INCREMENT,
    tracking_number INTEGER,
    order_date varchar(16),
    customer_id int not null,
    address_line1 varchar(100),
    address_line2 varchar(100),
    total INTEGER,
    status varchar(20),
    PRIMARY KEY (order_id),
    FOREIGN KEY(customer_id) references accounts(customer_id)
);

CREATE TABLE IF NOT EXISTS orderdetails(
	order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    primary key(order_id),
    foreign key(product_id) references products(product_id)
);

CREATE TABLE IF NOT EXISTS `contracts` (
	`contract_id` INT NOT NULL AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `order_id` int NOT NULL,
    primary key(`contract_id`),
    foreign key(`customer_id`) references accounts(`customer_id`),
    foreign key(`order_id`) references orders(`order_id`)
);

CREATE TABLE IF NOT EXISTS `payments` (
	`customer_id` int NOT NULL,
	`card_number` int NOT NULL,
    `expr_month` varchar(6) NOT NULL,
    `sec_code`	int NOT NULL,
    PRIMARY KEY(`customer_id`),
    FOREIGN KEY(`customer_id`) REFERENCES accounts(`customer_id`)
);

CREATE TABLE stores (
    store_id INT NOT NULL AUTO_INCREMENT,
    inventory INTEGER,
    phone VARCHAR(255),
    PRIMARY KEY (store_id)
);

CREATE TABLE warehouses(
    warehouse_id INT NOT NULL AUTO_INCREMENT,
    phone varchar(255),
    addr_line1 varchar(255),
    addr_line2 varchar(255),
    primary key(warehouse_id)
);

CREATE TABLE storeinventory(
	store_id INT NOT NULL,
    product_id VARCHAR(255),
    quantity VARCHAR(255),
    primary key(store_id),
    foreign key(store_id) references stores(store_id)
);

CREATE TABLE warehouseinventory(
    warehouse_id INT NOT NULL,
    product_id VARCHAR(255),
    quantity INTEGER,
    primary key(warehouse_id)
);

CREATE TABLE employees(
    employee_id VARCHAR(255),
    salary INTEGER,
    position VARCHAR(255),
    store_id INT,
    f_name VARCHAR(255),
    l_name VARCHAR(255),
    PRIMARY KEY (employee_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

CREATE TABLE cart(
	cart_id varchar(255) not null,
    customer_id int,
    primary key(cart_id),
    foreign key (customer_id) references accounts(customer_id)
);

CREATE TABLE cart_items(
	rowid int not null auto_increment,
	cart_id varchar(255) not null,
    product_id int not null,
    quantity int not null,
    primary key(rowid),
    foreign key(product_id) references products(product_id),
    foreign key(cart_id) references cart(cart_id)
);

INSERT INTO `accounts` (`customer_id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');
INSERT INTO `accounts` (`username`, `password`, `email`) VALUES ('sam.michelsen','1027','sammymichelsen@gmail.com');

INSERT INTO products (price, product_type, product_name, manufacturer) VALUES(300,'Entertainment','TV','Samsung'),(350,'Entertainment','4K TV','Sony'),(30,'Smart Home','Amazon Echo Dot','Amazon'),(1200,'Computers','Laptop','HP'),(150,'Computers','Monitor','Asus')
,(180,'Productivity','Printer','HP'),(10,'Entertainment','HDMI Cable','Belkin');