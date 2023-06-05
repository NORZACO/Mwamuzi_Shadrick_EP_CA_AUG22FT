const { Op, QueryTypes } = require("sequelize");

class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
        this.Category = db.Category;
        this.Item = db.Item;
        this.Role = db.Role;
        this.UserRole = db.UserRole;
        this.OrderItem = db.OrderItem;
        this.Order = db.Order;
    }


    // id, createdAt, updatedAt, UserId
    // all order
    async getOrderByUser(UserId) {
        const order = await this.Order.findOne({
            where: {
                UserId
            },
            include: {
                model: this.Item,
                // as: 'items',
                through: {
                    attributes: ['quantity', 'price']
                }
            }
        })
        // check the order
        if (!order) {
            throw new Error(`Order with UserId ${UserId} does not exist`);
        }

        return order;
    }





    // create order
    async addOrderToOrderitems(jwt_user_id, item_id, quantity, items_sku) {
        // start transaction t
        const t = await this.client.transaction();

        // search user by jwt_user_id and throw error if not found
        const findLoginUser = await this.User.findOne({ where: { id: jwt_user_id } });
        if (!findLoginUser) {
            throw new Error(`User with id ${jwt_user_id} does not exist`);
        }

        // search item_id and throw error if not found
        const findAndChoose = await this.Item.findOne({ where: { id: item_id } });
        if (!findAndChoose) {
            throw new Error(`Item with id ${item_id} does not exist`);
        }

        // search items_sku and throw error if not found
        const findItemBySku = await this.Item.findOne({ where: { sku: items_sku } });
        if (!findItemBySku) {
            throw new Error(`Item with sku ${items_sku} does not exist`);
        }

        /*
        // search cart by jwt_user_id
        const findOrderByUserId = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
        if (!findOrderByUserId) {
            throw new Error(`Cart with UserId ${jwt_user_id} does not exist`);
        }
        */



        try {

            // find order where UserId : jwt_user_id
            const findOrder = await this.Order.findOne({ where: { UserId: jwt_user_id } });
            // if order found
            if (findOrder) {
                // add item_id to orderitems
                const findOrderItem = await this.OrderItem.findOne({ where: { OrderId: findOrder.id, ItemId: item_id } });
                // if item_id found
                if (findOrderItem) {
                    // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
                    if (findAndChoose.stock_quantity < findOrderItem.quantity + quantity) {
                        throw new Error(`1 There is not enough stock_quantity for item with id ${item_id}`);
                    }
                    // update OrderItem { quantity, price, ItemId, OrderId }
                    await this.OrderItem.update({ quantity: findOrderItem.quantity + quantity },  { where: { OrderId: findOrder.id, ItemId: item_id } });
                     // update cart totalPrice
                    await this.Order.update({ totalPrice: findOrder.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                    await t.commit();
                    // return order
                    return await this.Order.findOne({ where: { UserId: jwt_user_id } });
                }

                // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
                if (findAndChoose.stock_quantity < quantity) {
                    throw new Error(`2 There is not enough stock_quantity for item with id ${item_id}`);
                }

                // create OrderItem { quantity, price, ItemId, OrderId }
                await this.OrderItem.create({ quantity, price : 1914, ItemId: item_id,  OrderId: findOrder.id });
                // await this.OrderItem.create({ OrderId: findOrder.id, ItemId: item_id, quantity });
                // update cart totalPrice  Order  { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId }
                await this.Order.update({ orderStatus : "pending", totalPrice: findOrder.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                // await this.Order.update({ totalPrice: findOrder.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                // saved






                // create order { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId}
                // const createOrder = await this.Order.create({ orderStatus: 'pending', totalPrice: findAndChoose.price * quantity,  discountPercentage : 0.25, Ordered_at : new Date(),  UserId: jwt_user_id });
                // // create orderitem { quantity, price, ItemId, OrderId }
                // await this.OrderItem.create({ quantity, price: findAndChoose.price, ItemId: item_id, OrderId: createOrder.id });
                // // update Item { stock_quantity }
                // await this.Item.update({ stock_quantity: findAndChoose.stock_quantity - quantity }, { where: { id: item_id } });
                // // commit transaction
                await t.commit();
                // return order
                return await this.Order.findOne({ where: { UserId: jwt_user_id } });
            }

            // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
            if (findAndChoose.stock_quantity < quantity) {
                throw new Error(`3 There is not enough stock_quantity for item with id ${item_id}`);
            }



            // create Order { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId }
            const createOrder = await this.Order.create({ orderStatus: 'pending', totalPrice: (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity, discountPercentage : 0.25, Ordered_at : new Date(), UserId: jwt_user_id });

            // const newCart = await this.Cart.create({ UserId: jwt_user_id, totalPrice: (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity });

            // create orderitem { quantity, price, ItemId, OrderId }
            await this.OrderItem.create({ quantity, price: 0, ItemId: item_id, OrderId: createOrder.id });

            // create cartItem
            // await this.CartItem.create({ CartId: newCart.id, ItemId: item_id, quantity });
            // saved




            // create order { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId}
            // const createOrder = await this.Order.create({ orderStatus: 'pending', totalPrice : findAndChoose.price * quantity, discountPercentage : 0.25, Ordered_at : new Date(), UserId: jwt_user_id });
            // create orderitem { quantity, price, ItemId, OrderId }
            // await this.OrderItem.create({ quantity, price: findAndChoose.price, ItemId: item_id, OrderId: createOrder.id });
            // // update Item { stock_quantity }
            // await this.Item.update({ stock_quantity: findAndChoose.stock_quantity - quantity }, { where: { id: item_id } });
            // commit transaction
            await t.commit();
            // return order
            return await this.Order.findOne({ where: { UserId: jwt_user_id } });
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }













}

module.exports = OrderService;


// exoprt

