-- DROP TABLE cart;
DROP TABLE cart;

-- INSERT INTO stocksalesdb.carts (id, createdAt, updatedAt, UserId) VALUES (NULL, NULL, NULL, NULL);
INSERT INTO
        stocksalesdb.carts (id, createdAt, updatedAt, UserId)
VALUES
        (1, NULL, NULL, NULL);

-- Path: sql\cart.sql
-- DROP TABLE cart;
INSERT INTO
        stocksalesdb.roles (name)
VALUES
        ('Guest');






CREATE VIEW
        allcarts AS
SELECT
        Carts.id,
        Carts.UserId,
        Carts.totalPrice,
        Users.firstName,
        Users.lastName,
        Items.id AS item_id,
        Items.item_name,
        Items.price,
        Items.sku,
        Items.stock_quantity,
        CartItems.quantity
FROM
        Carts
        INNER JOIN Users ON Carts.UserId = Users.id
        INNER JOIN CartItems ON Carts.id = CartItems.CartId
        INNER JOIN Items ON CartItems.ItemId = Items.id;









