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
                    attributes: ['quantity', 'price', 'itemId', 'OrderId']
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
        const find_login_user = await this.User.findOne({ where: { id: jwt_user_id } });
        if (!find_login_user) {
            throw new Error(`User with id ${jwt_user_id} does not exist`);
        }

        // search item_id and throw error if not found
        const find_Item = await this.Item.findOne({ where: { id: item_id } });
        if (!find_Item) {
            throw new Error(`Item with id ${item_id} does not exist`);
        }

        // search items_sku and throw error if not found
        const find_sku = await this.Item.findOne({ where: { sku: items_sku } });
        if (!find_sku) {
            throw new Error(`Item with sku ${items_sku} does not exist`);
        }


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
                    if (find_Item.stock_quantity < 0)/*< findOrderItem.quantity + quantity)*/ {
                        throw new Error(`There is not enough stock_quantity for item with id ${item_id}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findOrderItem.quantity} ,want to add: ${quantity}`);
                    }


                    /*ADD AND UPDATE THE TOTAL PRICE AND QUANTITY */
                    // update OrderItem { quantity, price, ItemId, OrderId }
                    await this.OrderItem.update({ quantity: findOrderItem.quantity + quantity }, { where: { OrderId: findOrder.id, ItemId: item_id } });
                    // update cart totalPrice
                    await this.Order.update({ totalPrice: findOrder.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });

                    // substract stock_quantity
                    await this.Item.update({ stock_quantity: find_Item.stock_quantity - quantity }, { where: { id: item_id } });
                    await t.commit();
                    // return 'Thanks 1'
                    return await this.Order.findOne({ where: { UserId: jwt_user_id } });
                }

                // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
                // if (find_Item.stock_quantity < quantity) {
                //     throw new Error(`2 There is not enough stock_quantity for item with id ${item_id}`);
                // }

                if (find_Item.stock_quantity < findOrderItem.quantity + quantity) {
                    throw new Error(`There is not enough stock_quantity for item with id ${item_id}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findOrderItem.quantity} ,want to add: ${quantity}`);
                }

                /*ADD A DIFERREMT ITEM AND ORDER */
                // create OrderItem { quantity, price, ItemId, OrderId }
                await this.OrderItem.create({ quantity, price: 1914, ItemId: item_id, OrderId: findOrder.id });
                // update cart totalPrice  Order  { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId }
                await this.Order.update({ orderStatus: "pending", totalPrice: findOrder.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });

                // substract stock_quantity
                await this.Item.update({ stock_quantity: find_Item.stock_quantity - quantity }, { where: { id: item_id } });

                await t.commit();
                // return 'Thanks 2'
                return await this.Order.findOne({ where: { UserId: jwt_user_id } });
            }

            // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
            // if (find_Item.stock_quantity < quantity) {
            //     throw new Error(`3 There is not enough stock_quantity for item with id ${item_id}`);
            // }
            if (find_Item.stock_quantity < 0)/*< findOrderItem.quantity + quantity)*/ {
                throw new Error(`There is not enough stock_quantity for item with id ${item_id}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findOrderItem.quantity} ,want to add: ${quantity}`);
            }

            /* CREATE A NEW ORDER AND CARTORDER */
            // create Order { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId }
            const createOrder = await this.Order.create({ orderStatus: 'pending', totalPrice: (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity, discountPercentage: 0.25, Ordered_at: new Date(), UserId: jwt_user_id });
            // create orderitem { quantity, price, ItemId, OrderId }
            await this.OrderItem.create({ quantity, price: 0, ItemId: item_id, OrderId: createOrder.id });

            // substract stock_quantity
            await this.Item.update({ stock_quantity: find_Item.stock_quantity - quantity }, { where: { id: item_id } });
            // commit transaction
            await t.commit();
            // return `Thanks 3`
            return await this.Order.findOne({ where: { UserId: jwt_user_id } });
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }



    // update
    async updateOrderItem(jwt_user_id, item_id, item_quantity, items_sku) {
        // start transaction
        const t = await this.client.transaction();
        try {
            // search user by jwt_user_id and throw error if not found
            const find_login_user = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!find_login_user) {
                throw new Error(`User with id ${jwt_user_id} does not exist`);
            }

            // search item_id and throw error if not found
            const find_Item = await this.Item.findOne({ where: { id: item_id } });
            if (!find_Item) {
                throw new Error(`Item with id ${item_id} does not exist`);
            }

            // search items_sku and throw error if not found
            const find_sku = await this.Item.findOne({ where: { sku: items_sku } });
            if (!find_sku) {
                throw new Error(`Item with sku ${items_sku} does not exist`);
            }

            // find order where UserId : jwt_user_id
            const findOrder = await this.Order.findOne({ where: { UserId: jwt_user_id } });
            if (!findOrder) {
                throw new Error(`Order with UserId ${jwt_user_id} does not exist`);
            }

            // add item_id to orderitems
            let findOrderItem = await this.OrderItem.findOne({ where: { OrderId: findOrder.id, ItemId: item_id } });
            if (!findOrderItem) {
                throw new Error(`OrderItem with OrderId ${findOrder.id} and ItemId ${item_id} does not exist`);
            }

            if (find_Item.stock_quantity <= 0 || find_Item.stock_quantity < findOrderItem.quantity + item_quantity) {
                throw new Error(`There is not enough ${find_Item.item_name}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findOrderItem.quantity} ,but want to add: ${item_quantity}`);
            }

            // update orderitem
            await findOrderItem.update({ quantity: item_quantity });

            // update cart totalPrice  Order  { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId }
            await findOrder.update({ totalPrice: find_Item.price * findOrderItem.quantity - (findOrderItem.quantity - item_quantity) });

            // PUT /cart_item/:id This endpoint should be accessible when a Registered User has logged in. This endpoint changes the desired quantity of a specific item in for the logged in user’s cart. The item's id should be provided with a new desired purchase quantity. When a cart item's desired purchase quantity is increased, the back-end must ensure enough stock of the item in the items table. The item’s stock quantity should only be updated once the order has been placed.
            if (find_Item.stock_quantity < findOrderItem.quantity + item_quantity) {
                throw new Error(`There is not enough stock_quantity for item with id ${item_id}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findOrderItem.quantity} ,want to add: ${item_quantity}`);
            }

            // update stock_quantity if item_quantity is plus or minus
            // await find_Item.update({ stock_quantity: find_Item.stock_quantity - (findOrderItem.quantity - item_quantity) });
            








            // substract stock_quantity if user update is minus and  substract stock_quantity if user update is minus
            await find_Item.update({ stock_quantity: find_Item.stock_quantity + (findOrderItem.quantity - item_quantity),
                // update cart totalPrice  Order  { id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId };
                totalPrice: find_Item.price * findOrderItem.quantity - (findOrderItem.quantity - item_quantity) }, { where: { id: item_id } });




            await t.commit();
            return {
                price: find_Item.price,
                totalPrice: findOrder.totalPrice,
                quantity: findOrderItem.quantity,
                stock_quantity: find_Item.stock_quantity,
                // // totalprice times 40%
                // coupon : findOrder.totalPrice * 0.4,
                // // totalprice minus 40%
                // totalprice_minus_coupon : findOrder.totalPrice - (findOrder.totalPrice * 0.4)
            }
            // return await this.Order.findOne({ where: { UserId: jwt_user_id } });
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }



    // Add coupon for user with same email









}

module.exports = OrderService;


// exoprt

