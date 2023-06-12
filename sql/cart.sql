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





-- all carts views'
CREATE VIEW
        allcarts AS
SELECT
        Carts.id,
        Carts.UserId,
        Carts.totalPrice,
        -- Users.firstName,
        -- Users.lastName,
        CONCAT(Users.firstName, ' ' ,Users.lastName) AS FullName,
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



-- all order views
CREATE VIEW
        allorders AS
SELECT
        Orders.id,
        Orders.UserId,
        Orders.totalPrice,
        Orders.orderStatus,
        CONCAT(Users.firstName, ' ' ,Users.lastName) AS FullName,
        Items.id AS item_id,
        Items.item_name,
        Items.price,
        Items.sku,
        Items.stock_quantity,
        OrderItems.quantity
FROM
        Orders
        INNER JOIN Users ON Orders.UserId = Users.id
        INNER JOIN OrderItems ON Orders.id = OrderItems.OrderId
        INNER JOIN Items ON OrderItems.ItemId = Items.id;









