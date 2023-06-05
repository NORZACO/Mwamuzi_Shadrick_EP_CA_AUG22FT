



CREATE SCHEMA 'StockSalesDB';

CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

GRANT ALL PRIVILEGES ON StockSalesDB.* TO 'admin'@'localhost';