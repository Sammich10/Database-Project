CREATE TABLE Store (
    store_id VARCHAR(20),
    hours VARCHAR (5),
    inventory INTEGER,
    phone CHAR(12),
    PRIMARY KEY (store_id)
);

CREATE TABLE Employee(
    emp_id VARCHAR(20),
    salary INTEGER,
    position VARCHAR(15),
    store_id VARCHAR(20),
    f_name VARCHAR(20),
    l_name VARCHAR(20),
    PRIMARY KEY (emp_id),
    FOREIGN KEY (store_id) REFERENCES Store(store_id)
);

CREATE TABLE Location(
    city VARCHAR(10),
    zip INTEGER,
    state CHAR(2),
    address VARCHAR(15),
    loc_id INTEGER,
    PRIMARY KEY (loc_id)
);

CREATE TABLE Warehouse(
    ware_id INTEGER,
    capacity INTEGER,
    phone CHAR(12),
    hours VARCHAR (5),
    inventory INTEGER,
    PRIMARY KEY (ware_id)
    );
    
CREATE TABLE Customer(
    cust_id INTEGER,
    phone CHAR(12),
    hours VARCHAR (5),
    email VARCHAR(20),
    PRIMARY KEY(cust_id)
    );
    
CREATE TABLE Department(
    dept_id INTEGER,
    supervisor INTEGER,
    sup_id INTEGER,
    PRIMARY KEY(dept_id)
    );
    
CREATE TABLE Product(
    prod_id INTEGER,
    upc_code VARCHAR(25),
    product_name VARCHAR(20),
    price INTEGER,
    size CHAR(8),
    PRIMARY KEY(prod_id)
    );
    
CREATE TABLE CustOrder (
    order_id INTEGER,
    return CHAR(3),
    quantity INTEGER,
    warranty CHAR(1),
    total INTEGER,
    PRIMARY KEY (order_id)
    );
    
CREATE TABLE Payment (
    card_num INTEGER,
    Vendor VARCHAR(15),
    total INTEGER,
    PRIMARY KEY (card_num)
);

CREATE TABLE Shipping(
    Vendor VARCHAR(15),
    city VARCHAR(10),
    zip INTEGER,
    state CHAR(2),
    address VARCHAR(15),
    PRIMARY KEY (vendor)
    );
    
    
    
