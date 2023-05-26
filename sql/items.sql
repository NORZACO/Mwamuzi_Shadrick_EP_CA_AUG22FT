INSERT INTO
    `stocksalesdb`.`items` (
        `id`,
        `name`,
        `price`,
        `sku`,
        `stock_quantity`,
        `img_url`,
        `CategoryId`
    )
VALUES
    (NULL, NULL, NULL, NULL, NULL, NULL, NULL);



SELECT `id`, `item_name`, `price`, `sku`, `stock_quantity`, `img_url`, `CategoryId` 
FROM `Items` AS `Item` 
WHERE `Item`.`id` = '130' 
  AND `Item`.`item_name` = 'xFacial Cleanser' 
  AND `Item`.`price` = 2 
  AND `Item`.`sku` = 'xBT136'
  AND `Item`.`stock_quantity` = 3 
  AND `Item`.`img_url` = 'xhttp://example.com/image/Facial Cleanser.jpg' 
  AND `Item`.`CategoryId` = 1;



-- id, createdAt, updatedAt, UserId
-- INSERT INTO `stocksalesdb`.`carts` (`id`, `createdAt`, `updatedAt`, `UserId`) VALUES (1, NULL, NULL, NULL);
INSERT INTO `stocksalesdb`.`carts` (`id`, `createdAt`, `updatedAt`, `UserId`) 
VALUES (3, `11/11/1998`, `11/11/1998`, 1);




INSERT INTO `stocksalesdb`.`cartitems` (`quantity`, `CartId`, `ItemId`) VALUES (NULL, NULL, NULL);

INSERT INTO `stocksalesdb`.`cartitems` (`quantity`, `CartId`, `ItemId`) VALUES (1, 1, 1);


INSERT INTO `stocksalesdb`.`carts` (`id`, `createdAt`, `updatedAt`, `UserId`) VALUES (NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

