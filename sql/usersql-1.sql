

CREATE SCHEMA StockSalesDB;

CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';

GRANT ALL PRIVILEGES ON StockSalesDB.* TO 'admin'@'localhost';


-- INSERT INTO `stocksalesdb`.`roles` (`id`, `name`) VALUES (NULL, NULL);
INSERT INTO `stocksalesdb`.`roles` (`id`, `name`) VALUES (3, 'member');



-- INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `password`, `role_id`) VALUES (NULL, NULL, NULL, NULL);
INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `password`, `role_id`) 
VALUES (1, 'admin', 'P@ssw0rd', 1),
        (2, 'user', 'P@ssw0rd', 1),
        (3, 'user2', 'P@ssw0rd', 1),
        (4, 'user3', 'P@ssw0rd', 1);
         

-- INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `email`, `encryptedPassword`, `roleId`) VALUES (NULL, NULL, NULL, NULL, NULL);
-- INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `email`, `encryptedPassword`, `roleId`) VALUES (1, 'admin', 'admin', 'P@ssw0rd', 1);
INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `email`, `encryptedPassword`, `roleId`) VALUES (2, 'user', 'user', 'P@ssw0rd', 1);


SELECT * FROM users;
