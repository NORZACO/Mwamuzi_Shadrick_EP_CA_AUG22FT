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




    //  getAllCategories
    async getOrderByUser(jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            // throrw error
            throw new Error(`No Guest Access `);
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            const order = await this.Order.findOne({
                where: {
                    UserId: jwt_user_id
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
                throw new Error(`Order with UserId ${user.firstName} does not exist`);
            }

            return order;
        }


        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            const order = await this.Order.findAll({
                // where: {
                //     UserId: jwt_user_id
                // },
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
                throw new Error(`Order with UserId ${user.firstName} does not exist`);
            }

            return order;
        }

    }


    // create order
    async addOrderToOrderitems(jwt_user_role, jwt_user_id, item_id, itemQuantity) {
        // start transaction
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);


        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error('http://127.0.0.1:3000/login');
        }


        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            throw new Error(`Use your personal acount`);
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            // check item
            const item = await this.Item.findByPk(item_id);
            if (!item) {
                throw new Error(`Item with id ${item_id} does not exist`);
            }



            //  quantity in cartItem
            const orderItem = await this.OrderItem.findOne({ where: { ItemId: item.id } });

            //   // check
            if (orderItem) {
                // check if the item is in stock
                if (item.stock_quantity < itemQuantity || item.stock_quantity === 0) {
                    throw new Error(`Out-of-stock`)
                }
            }

            const t = await this.client.transaction();
            // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate
            try {
                // colums : id, orderStatus, totalPrice, discountPercentage, Ordered_at, UserId
                const [createNewOrder, created] = await this.Order.findOrCreate({
                    where: { userId: user.id },
                    defaults: {
                        orderStatus: 'pending',
                        totalPrice: itemQuantity * item.price,
                        discountPercentage: 0.25,
                        Ordered_at: new Date(),
                        UserId: user.id
                    }
                });


                // COLUMS :  quantity, price, ItemId, OrderId
                const [createNewOrderItem, createdOrderItem] = await this.OrderItem.findOrCreate({
                    where: { OrderId: createNewOrder.id, ItemId: item.id },
                    defaults: {
                        quantity: itemQuantity,
                        price: /*item.price*/ 10,
                        ItemId: item.id,
                        OrderId: createNewOrder.id
                    }
                });

                // Check if the cart is created or found
                if (created && createdOrderItem) {
                    console.log('\n\nNew order created and new order item created\n\n');
                    // update Item stock
                    await this.Item.update({ stock_quantity: item.stock_quantity - itemQuantity }, { where: { id: item.id } });


                } else if (!created && !createdOrderItem) {
                    console.log('\n\nExisting cart found and existing cart item found\n\n');
                    // Calculate the updated total price
                    const totalPrice = createNewOrder.totalPrice + itemQuantity * item.price;
                    // Update the total price and cart item quantity
                    await createNewOrder.update({ totalPrice });
                    await createNewOrderItem.update({ quantity: createNewOrderItem.quantity + itemQuantity });

                    // // update Item stock
                    await this.Item.update({ stock_quantity: item.stock_quantity - itemQuantity }, { where: { id: item.id } });


                } else if (!created && createdOrderItem) {
                    console.log('\n\nExisting cart found and new cart item created\n\n');
                    // Calculate the updated total price
                    const totalPrice = createNewOrder.totalPrice + itemQuantity * item.price;
                    // Update the total price and cart item quantity
                    await createNewOrder.update({ totalPrice });
                    // await createNewCartItem.update({ quantity: createNewCartItem.quantity + itemQuantity });

                    // // update Item stock
                    await this.Item.update({ stock_quantity: item.stock_quantity - itemQuantity }, { where: { id: item.id } });


                } else {
                    console.log('\n\nUnexpected condition\n\n');
                }



                await t.commit();
                return await this.Order.findAll(
                    {
                        where: { userId: user.id },
                        include: [
                            {
                                model: this.Item,
                                attributes: ['item_name', 'price', 'stock_quantity', 'sku', 'img_url'],
                                include: [{
                                    model: this.Category,
                                    attributes: ['name']
                                }
                                ]
                            }
                        ]
                    }
                );
            } catch (error) {
                await t.rollback();
                throw new Error(error);
            }
        }
    }


    async updateOrderItem(jwt_user_role, jwt_user_id, order_id, status) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // guest
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`No guest allowed`)
        }

        // Register
        if (userRole.id === jwt_user_role && userRole.name === 'Registered') {
            throw new Error(`No Registered allowed`)
        }


        // if user role is not admin
        const t = await this.client.transaction();

        if (userRole.id === jwt_user_role && userRole.name === 'Admin') {
            const t = await this.client.transaction();

            try {
                // find the order
                const order = await this.Order.findByPk(order_id);
                // if order is not found
                if (!order) {
                    throw new Error(`Order with id ${order_id} does not exist`);
                }

                // https://sebhastian.com/sequelize-enum/#:~:text=Sequelize%20provides%20the%20ENUM%20data%20type%20that%20you,has%20the%20status%20attribute%20that%E2%80%99s%20an%20ENUM%20type%3A
                const getAttr = this.Order.getAttributes().orderStatus.values;
                // check if the status is valid
                
                // update OrderStatus
                await order.update({ orderStatus: status });
             


                await t.commit();
                // return message
                return order
                
            } catch (error) {
                await t.rollback();
                throw new Error(error);
            }

        }
    }


}

module.exports = OrderService;


// exoprt

