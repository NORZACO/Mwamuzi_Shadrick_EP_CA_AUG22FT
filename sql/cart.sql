-- DROP TABLE cart;
DROP TABLE cart;

-- INSERT INTO stocksalesdb.carts (id, createdAt, updatedAt, UserId) VALUES (NULL, NULL, NULL, NULL);
INSERT INTO
        stocksalesdb.carts (id, createdAt, updatedAt, UserId)
VALUES
        (1, NULL, NULL, NULL);

SELECT
        Cart.id,
        Cart.createdAt,
        Cart.updatedAt,
        Cart.UserId,
        Items.id AS Items.id,
        Items.item_name AS Items.item_name,
        Items.price AS Items.price,
        Items.categoryId AS Items.categoryId,
        Items->CartItem.quantity AS Items.CartItem.quantity,
        Items->CartItem.CartId AS Items.CartItem.CartId,
        Items->CartItem.ItemId AS Items.CartItem.ItemId
FROM
        Carts AS Cart
        LEFT OUTER JOIN (
                CartItems AS Items->CartItem
                INNER JOIN Items AS Items ON Items.id = Items->CartItem.ItemId
        ) ON Cart.id = Items->CartItem.CartId;