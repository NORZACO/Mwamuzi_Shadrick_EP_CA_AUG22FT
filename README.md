# Mwamuzi_Shadrick_EP_CA_AUG22FT


TABLES
### Models
* Users
* Roles
* items
* categories
* carts
* cart items
* orders
* order items


create database
```sql
CREATE SCHEMA StockSalesDB;

CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

GRANT ALL PRIVILEGES ON StockSalesDB.* TO 'admin'@'localhost';
```
clone the repo on your machine
```bash
git clone https://github.com/NORZACO/Mwamuzi_Shadrick_EP_CA_AUG22FT.git
```
install packages

```bash
npm install
```


Generate the .env variables 

```bash
node generate_random_string.js
```
run on mac. you need to have nodemon install on your machine to use npm run dev (easy for debugging).
if you dont want to use nodemon replace "npm run dev" to "npm start"

```bash
  DEBUG=Mwamuzi_Shadrick_EP_CA_AUG22FT:* & npm run dev
```
run on Window
```bash
 SET DEBUG=Mwamuzi_Shadrick_EP_CA_AUG22FT:* & npm run dev
```

run request to set up. this is the core of this app for initial data
```bash
 http://127.0.0.1:3000/setup
```
