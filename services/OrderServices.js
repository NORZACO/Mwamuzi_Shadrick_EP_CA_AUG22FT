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


    // id, createdAt, updatedAt, UserId
    // all cart
    async getCartByUserId(UserId) {
        const cart = await this.Cart.findOne({
            where: { UserId: UserId },
            include: [
                {
                    model: this.Item,
                    include: [
                        {
                            model: this.Category,
                        }
                    ]
                }
            ]
        });
        return cart;
    }





    // create order
    async createOrder(UserId) {
        const cart = await this.Cart.findOne({ where: { UserId: UserId } });
        if (!cart) {
            throw new Error('the cart does not exist');
        }
        const order = await this.Cart.update({ status: 'ordered' }, { where: { UserId: UserId } });
        return order;
    }

    // create OrderItem and Order
    async createOrderItem(UserId) {
        const cart = await this.Cart.findOne({ where: { UserId: UserId } });
        if (!cart) {
            throw new Error('the cart does not exist');
        }
        const order = await this.Cart.update({ status: 'ordered' }, { where: { UserId: UserId } });
        const cartItems = await this.CartItem.findAll({ where: { CartId: cart.id } });
        const orderItems = cartItems.map((item) => {
            return {
                CartItemId: item.id,
                OrderId: cart.id,
                quantity: item.quantity
            }
        });
        const orderItem = await this.OrderItem.bulkCreate(orderItems);
        return orderItem;
    }

// create order and OrdertItem
    async createOrderAndOrderItem(UserId) {
        const cart = await this.Cart.findOne({ where: { UserId: UserId } });
        if (!cart) {
            throw new Error('the cart does not exist');
        }
        const order = await this.Cart.update({ status: 'ordered' }, { where: { UserId: UserId } });
        const cartItems = await this.CartItem.findAll({ where: { CartId: cart.id } });
        const orderItems = cartItems.map((item) => {
            return {
                CartItemId: item.id,
                OrderId: cart.id,
                quantity: item.quantity
            }
        });
        const orderItem = await this.OrderItem.bulkCreate(orderItems);
        return orderItem;
    }


}

module.exports = OrderService;


// exoprt

