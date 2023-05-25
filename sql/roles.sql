


SELECT * FROM roles;

SELECT * FROM stocksalesdb.users;

SELECT * FROM stocksalesdb.roles;



-- INSERT INTO roles (`id`, `name`)VALUES(id, 'name');
INSERT INTO roles (`id`, `name`)VALUES(2, 'Admin');

-- INSERT INTO `Users` (`id`,`username`,`email`,`encryptedPassword`,`salt`,`roleId`) VALUES (DEFAULT,?,?,?,?,?);
INSERT INTO `Users` (`id`,`username`,`email`,`encryptedPassword`,`roleId`) VALUES (DEFAULT,'admin','tugrp@example.com','$2a$10$./..',2);
