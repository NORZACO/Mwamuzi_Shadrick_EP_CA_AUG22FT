


SELECT * FROM roles;

SELECT * FROM stocksalesdb.users;

INSERT INTO roles (`id`, `name`)
VALUES
(2, 'member');

INSERT INTO `Users` (`id`,`username`,`email`,`encryptedPassword`,`salt`,`roleId`) VALUES (DEFAULT,?,?,?,?,?);