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
    }




    async createOrder(UserId) {
        try {
            const createOrder = await this.client.transaction(async (t) => {
                // create order
                const order = await this.Cart.create({
                    UserId: UserId,
                    status: "pending"
                }, { transaction: t });

                // get cart
                const cart = await this.Cart.findOne({
                    where: {
                        UserId: UserId,
                        status: "pending"
                    }
                }, { transaction: t });


                // get cartItem
                const cartItem = await this.CartItem.findAll({
                    where: {
                        CartId: cart.id
                    }
                }, { transaction: t });

                // create orderItem
                for (let i = 0; i < cartItem.length; i++) {
                    const orderItem = await this.OrderItem.create({
                        OrderId: order.id,
                        ItemId: cartItem[i].ItemId,
                        quantity: cartItem[i].quantity
                    }, { transaction: t });
                }

                // delete cartItem
                for (let i = 0; i < cartItem.length; i++) {
                    const deleteCartItem = await this.CartItem.destroy({
                        where: {
                            CartId: cart.id
                        }
                    }, { transaction: t });
                }

                // delete cart
                const deleteCart = await this.Cart.destroy({
                    where: {
                        UserId: UserId,
                        status: "pending"
                    }
                }, { transaction: t });

                return order;
            });

            return createOrder;
        } catch (error) {
            throw error;
        }
    }



    // create Order and Orderitems substract
    async createOrders(UserId) {
        try {
            const createOrder = await this.client.transaction(async (t) => {
                // create order
                // const order = await this.Cart.create({
                //     UserId: UserId,
                //     status: "pending"
                // }, { transaction: t });

                // get cart
                const cart = await this.Cart.findOne({
                    where: {
                        UserId: UserId,
                        status: "pending"
                    }
                }, { transaction: t });
                // get cartItem

                const cartItem = await this.CartItem.findAll({
                    where: {
                        CartId: cart.id
                    }
                }, { transaction: t });
                // substract cartItem


                for (let i = 0; i < cartItem.length; i++) {
                    const item = await this.Item.findOne({
                        where: {
                            id: cartItem[i].ItemId
                        }
                    }, { transaction: t });

                    const substract = await this.Item.update({
                        stock: item.stock - cartItem[i].quantity
                    }, {
                        where: {
                            id: cartItem[i].ItemId
                        }
                    }, { transaction: t });
                }



                // create orderItem
                // for (let i = 0; i < cartItem.length; i++) {
                //     const orderItem = await this.OrderItem.create({
                //         OrderId: order.id,
                //         ItemId: cartItem[i].ItemId,
                //         quantity: cartItem[i].quantity
                //     }, { transaction: t });
                // }
                // // delete cartItem
                // for (let i = 0; i < cartItem.length; i++) {
                //     const deleteCartItem = await this.CartItem.destroy({
                //         where: {
                //             CartId: cart.id
                //         }
                //     }, { transaction: t });
                // }
                // delete cart
                const deleteCart = await this.Cart.destroy({
                    where: {
                        UserId: UserId,
                        status: "pending"
                    }
                }, { transaction: t });
                return order;
            });
            return createOrder;
        } catch (error) {
            throw error;
        }
    }




























}

module.exports = OrderService;


// exoprt

