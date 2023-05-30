
const { Op, QueryTypes } = require("sequelize");


class CatergotyServices {
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

    // GET ALL CART CartServices
    async getAllCarts() {
        const carts = await this.Cart.findAll(
        );
        return carts;
    }


    // Cart endpointsGET /cart This endpoint should be accessible when a Registered User has logged in. 
    // This endpoint should only return the cart for the logged-in user. 
    // The user information should be extracted from the JWT. No user information should be sent with the API request.

    async getCartByUserId(userId) {
        const cart = await this.Cart.findAll({
            where: { userId: userId },
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
        });
        return cart;
    }



    // CREATE carts with id, createdAt, updatedAt, UserId and cartitems quantity, CartId, ItemId
    async createCartAndCartitem1(jwt_user_id, item_id, quantity) {
        // check if item_id exist   
        const t = await this.client.transaction();
        try {
            const item = await this.Item.findOne({ where: { id: item_id } });
            if (!item) {
                throw new Error('Item with a given id not found');
            }

            // check user by jwt_user_id
            const user = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!user) {
                throw new Error('User with a given id not found');
            }

            // transcaction
            const cart = await this.Cart.create({
                createdAt: new Date(),
                updatedAt: new Date(),
                UserId: jwt_user_id
            });


            // calculate items remanaing in the stock
            const itemsRemaining = item.stock_quantity - quantity
            // check
            if (itemsRemaining < 0) {
                throw new Error('Not enough items in stock');
            }

            console.log(`
            -----------------------------------------------------------------------------------
            | items:${itemsRemaining} |stock : ${item.stock_quantity} | ${quantity}           |
            -----------------------------------------------------------------------------------
            `)
            // update items stock_quantity

            await this.Item.update({ stock_quantity: itemsRemaining }, { where: { id: item_id } });
            // save
            await item.save();

            // create cartitems
            await this.CartItem.create({
                quantity: quantity,
                CartId: cart?.id,
                ItemId: item_id
            });
            await t.commit();
            return cart

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }




    // async createCartAndCartiten2
    async reTurnStock(item_id) {
        // check if item_id exist
        const item = await this.Item.findOne({ where: { id: item_id } });
        if (!item || item === null || item > 0) {
            throw new Error('Item with a given id not found');
        }
        // return stock
        const stock = item.stock_quantity;
        return stock
    }




    //check if the cart with same jwt_user_id exist
    async checkCartbyJWT(jwt_user_id) {
        const cart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
        if (!cart) {
            throw new Error('Cart with a given id not found');
        }
        return cart
    }



    // check if the cartitem with same cartId and item_id exist
    async checkCartitem(cartId, item_id) {
        const cartitem = await this.CartItem.findOne({ where: { CartId: cartId, ItemId: item_id } });
        if (!cartitem) {
            throw new Error('Cartitem with a given id not found');
        }
        return cartitem
    }



    // add item to cart
    async createCart(jwt_user_id, quantity, item_id, itemsRemaining) {
        const t = await this.client.transaction();
        // create a cart with a login user
        try {
            // create a cart
            const cart = await this.Cart.create({ createdAt: new Date(), updatedAt: new Date(),  UserId: jwt_user_id });
            // create a cartitem
            await this.CartItem.create({ quantity: quantity, CartId: cart?.id, ItemId: item_id });
            // update items stock_quantity
            await this.Item.update({ stock_quantity: itemsRemaining }, { where: { id : item_id } });
            // save
            await t.commit();
            return cart
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }












    // UPDATE CARTITEM
    async updateCartitem(cartId, item_id, quantity) {
        // check if item_id exist
        const item = await this.Item.findOne({ where: { id: item_id } });
        if (!item) {
            throw new Error('Item with a given id not found');
        }
        // check if cart_id exist
        const cart = await this.Cart.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error('Cart with a given id not found');
        }
        // calculate items remanaing in the stock
        const itemsRemaining = item.stock_quantity - quantity
        // update items stock_quantity
        const updatedItem = await this.Item.update({ stock_quantity: itemsRemaining }, { where: { id: item_id } });
        // save
        await updatedItem.save();
        // update cartitem
        const updatedCartitem = await this.CartItem.update({ quantity: quantity }, { where: { CartId: cartId, ItemId: item_id } });
        // save
        await updatedCartitem.save();
        return updatedCartitem;
    }



























    // create orders: id, order_date, UserId amd cartitems : quantity, price, ItemId, OrderId
    async createOrderAndOrderItem(jwt_user_id, cartId) {
        // check if item_id exist   
        const t = await this.client.transaction();
        try {
            // create order
            const order = await this.Order.create({
                order_date: new Date(),
                UserId: jwt_user_id
            });

            // get cartitems
            const cartitems = await this.CartItem.findAll({ where: { CartId: cartId } });

            // create orderitems
            for (let i = 0; i < cartitems.length; i++) {
                await this.OrderItem.create(
                    {
                        quantity: cartitems[i].quantity,
                        price: cartitems[i].Item.price,
                        ItemId: cartitems[i].ItemId,
                        OrderId: order.id
                    }
                );
            }
            await t.commit();
            return order.id;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }























}




//TODO: Creat user service
module.exports = CatergotyServices;







