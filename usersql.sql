
USE stocksalesdb;

SELECT * FROM cartitems LIMIT 100;



SELECT * FROM users LIMIT 100;

SHOW INDEX FROM 'UserRoles';




-- INSERT INTO `stocksalesdb`.`roles` (`id`, `name`) VALUES (NULL, NULL);
INSERT INTO `stocksalesdb`.`roles` (`id`, `name`) VALUES ( 6, "superviser");


-- INSERT INTO `stocksalesdb`.`userroles` (`createdAt`, `updatedAt`, `RoleId`, `UserId`) VALUES (NULL, NULL, NULL, NULL);
INSERT INTO `stocksalesdb`.`userroles` (`createdAt`, `updatedAt`, `RoleId`, `UserId`)
VALUES ('2023-05-17 09:00:00', '2023-05-17 09:00:00', 1, 1);


