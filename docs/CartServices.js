
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
        return await this.Cart.findAll(
        );
    }


    // Cart endpointsGET /cart This endpoint should be accessible when a Registered User has logged in. 
    // This endpoint should only return the cart for the logged-in user. 
    // The user information should be extracted from the JWT. No user information should be sent with the API request.

    async getCartByUserId(userId) {
        return await this.Cart.findAll({
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
    }



    // CREATE carts with id, createdAt, updatedAt, UserId and cartitems quantity, CartId, ItemId
    async addItemToCart_and_ToCartItem(jwt_user_id, item_id, quantity, items_sku) {
        // check if item_id exist   
        const t = await this.client.transaction();
        try {

            // find item with sku and id
            const item = await this.Item.findOne({ where: { sku: items_sku, id: item_id } });
            if (!item) {
                throw new Error('Item with a given id does not exist');
            }

            // check user by jwt_user_id
            const user = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!user) {
                throw new Error('User with a given id does not exist');
            }

            // check cart with id, jwt_user_id include  i Items with sku
            const findCart_with_JWTid_and_Itemsku = await this.Cart.findAll({
                where:
                {
                    UserId: jwt_user_id
                    // , id: cart_id
                },
                include: [{
                    model: this.Item,
                    where: { sku: items_sku }
                }]
            });

            // check
            if (findCart_with_JWTid_and_Itemsku.length > 0) {
                const cartitem = await this.CartItem.findOne({ where: { ItemId: item_id } });
                if (!cartitem) {
                    throw new Error('Cartitem with a given id does not exist');
                }
                // update  quantity + newquantity
                const newQuantity = cartitem.quantity + quantity;
                // check if there is enough stock
                if (newQuantity > item.stock_quantity) {
                    throw new Error('There is not enough stock');
                }
                await this.CartItem.update({ quantity: newQuantity }, { where: { ItemId: item_id } });
                // save
                await cartitem.save();
                // update items stock_quantity
                //logo
                console.log(`
                ---------------------------------
                |   ITEMS HAVE BEEN ADDED     |
                ---------------------------------
                `)
                await t.commit();
                return cartitem
            }
            // create cart
            const cartDoesntExist = await this.Cart.create({ createdAt: new Date(), updatedAt: new Date(), UserId: jwt_user_id });
            // save
            await cartDoesntExist.save();
            console.log('THE CART HAVE BEEN SUCCESSFULLY CREATE IN THE DATABASE');
            // check if user have a cartItem
            const cartitem = await this.CartItem.findOne({ where: { id: cartDoesntExist?.id, UserId: jwt_user_id } });
            if (cartitem) {
                throw new Error(`Login user already have a Cartiten with the id already exist`);
            }
            //if login user have a cartItem, add tp the same cartItem
            // calculate price
            // const price = item.price * quantity;
            await this.CartItem.create({ quantity, CartId: cartDoesntExist.id, ItemId: item_id });
            await t.commit();
            return cartDoesntExist
            // commit
        } catch (error) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            throw new Error(error.message);
        }
    }





    // addItemToCart_and_ToCartItem Managed transactions
    // CREATE carts with id, createdAt, updatedAt, UserId and cartitems quantity, CartId, ItemId
    async addItemToCart_and_ToCartItem_ManagedTransactions(jwt_user_id, item_id, quantity, items_sku) {
        // check if item_id exist   
        const t = await this.client.transaction();
        try {

            // find item with sku and id
            const item = await this.Item.findOne({ where: { sku: items_sku, id: item_id } });
            if (!item) {
                throw new Error('Item with a given id does not exist');
            }

            // check user by jwt_user_id
            const user = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!user) {
                throw new Error('User with a given id does not exist');
            }

            // check cart with id, jwt_user_id include  i Items with sku
            const findCart_with_JWTid_and_Itemsku = await this.Cart.findAll({
                where:
                {
                    UserId: jwt_user_id
                    // , id: cart_id
                },
                include: [{
                    model: this.Item,
                    where: { sku: items_sku }
                }]
            });

            // find if user have aleardy have a cart
            const cartitemExist = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            // check
            if (findCart_with_JWTid_and_Itemsku.length > 0) {
                // update cartitem quantity
                const cartitem = await this.CartItem.findOne({ where: { ItemId: item_id } });
                if (!cartitem) {
                    throw new Error('Cartitem with a given id does not exist');
                }
                // update  quantity + newquantity
                const newQuantity = cartitem.quantity + quantity;
                // check if there is enough stock
                if (newQuantity > item.stock_quantity) {
                    throw new Error('There is not enough stock');
                }
                await this.CartItem.update({ quantity: newQuantity }, { where: { ItemId: item_id } });

                // update totalPrice, status, updatedAt where is UserId
                const totalPrice = item.price * newQuantity;
                await this.Cart.update({ totalPrice, status: 'active', updatedAt: new Date() }, { where: { UserId: jwt_user_id } });
                await cartitem.save();
                await t.commit();
                return cartitem





            } else if (cartitemExist) {
                // create CartItem
                const cartitem = await this.CartItem.create({ quantity, CartId: cartitemExist.id, ItemId: item_id });
                // update totalPrice, status, updatedAt where is UserId
                const totalPrice = item.price * quantity;
                await this.Cart.update({ totalPrice, status: 'active', updatedAt: new Date() }, { where: { UserId: jwt_user_id } });
                // save
                await cartitem.save();
                await t.commit();
                return cartitem
            }






            else {
                const totalPrice = item.price * quantity;
                const cartDoesntExist = await this.Cart.create({ totalPrice, status: 'active', createdAt: new Date(), updatedAt: new Date(), UserId: jwt_user_id });
                // save
                await cartDoesntExist.save();
                const newQuantity = quantity;
                // check if there is enough stock
                if (newQuantity > item.stock_quantity) {
                    throw new Error('There is not enough stock');
                }
                await this.CartItem.create({ quantity: quantity, CartId: cartDoesntExist.id, ItemId: item_id });
                await t.commit();
                return cartDoesntExist
            }





            
            // commit
        } catch (error) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            throw new Error(error.message);
        }
    }
















    // Create Orders and Orderstimes with quantity, price, ItemId, OrderId
    async createOrder(jwt_user_id, item_id, quantity, items_sku) {
        // check if item_id exist
        const t = await this.client.transaction();
        try {
            // find item with sku and id
            const item = await this.Item.findOne({ where: { sku: items_sku, id: item_id } });
            if (!item) {
                throw new Error('Item with a given id does not exist');
            }
            // find cart item with item_id
            const cartitem = await this.CartItem.findOne({ where: { ItemId: item_id } });
            if (!cartitem) {
                throw new Error('Cartitem with a given id does not exist');
            }
            // check user by jwt_user_id
            const user = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!user) {
                throw new Error('User with a given id does not exist');
            }
            // check cart with id, jwt_user_id include  i Items with sku
            const findCart_with_JWTid_and_Itemsku = await this.Cart.findAll({
                where:
                {
                    UserId: jwt_user_id
                    // , id: cart_id
                },
                include: [{
                    model: this.Item,
                    where: { sku: items_sku }
                }]
            });
            // check
            if (findCart_with_JWTid_and_Itemsku.length > 0) {
                // update cartitem quantity
                const cartitem = await this.CartItem.findOne({ where: { ItemId: item_id } });
                if (!cartitem) {
                    throw new Error('Cartitem with a given id does not exist');
                }
                // update  quantity + newquantity
                const newQuantity = cartitem.quantity + quantity;
                // check if there is enough stock
                if (newQuantity > item.stock_quantity) {
                    throw new Error('There is not enough stock');
                }
                await this.CartItem.update({ quantity: newQuantity }, { where: { ItemId: item_id } });
                // save
                await cartitem.save();
                // update items stock_quantity
                //logo
                console.log(`
                ---------------------------------
                |   ITEMS HAVE BEEN UPDATED     |
                ---------------------------------
                `)
                await t.commit();
                return cartitem
            }
            // create cart
            const cartDoesntExist = await this.Cart.create({ createdAt: new Date(), updatedAt: new Date(), UserId: jwt_user_id });
            console.log('THE CART HAVE BEEN SUCCESSFULLY CREATE IN THE DATABASE');
            // create cartitems
            await this.CartItem.create({ quantity: quantity, CartId: cartDoesntExist?.id, ItemId: item_id });
            await t.commit();
            return cartDoesntExist
            // commit
        } catch (error) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            throw new Error(error.message);
        }
    }





    /*
    
    
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
    
        // getItemBySku
        async getItemBySku(sku) {
            const item = await this.Item.findOne({ where: { sku: sku } });
            if (!item) {
                throw new Error('Item with a given id not found');
            }
            return item
        }
    
    
        // check cart by sku and jwt_user_id
        async getCartItemBySku(sku, jwt_user_id) {
            const cart = await this.Cart.findOne({
                where: { UserId: jwt_user_id },
                include: [
                    {
                        model: this.Item,
                        attributes: ['item_name', 'price', 'stock_quantity', 'sku', 'img_url'],
                        where: { sku: sku },
                        include: [{
                            model: this.Category,
                            attributes: ['name']
                        }
                        ]
                    }
                ]
            });
            // if (!cart) {
            //     throw new Error('Cart with a given id not found');
            // }
            return cart
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
    
    
    
    
    
        // add item to cart
        async createCart(jwt_user_id, quantity, item_id ) {
            const t = await this.client.transaction();
    
            // create a cart with a login user
            try {
                // check jwt_user_id
                const user = await this.User.findOne({ where: { id: jwt_user_id } });
                if (!user) {
                    throw new Error('User with a given id not found');
                }
                // check item_id and sku
    
                const item = await this.Item.findOne({ where: { id: item_id } });
                if (!item) {
                    throw new Error('Item with a given id not found');
                }
    
                // call reTurnStock
                const stock = await this.reTurnStock(item_id);
                // calculate items remanaing in the stock
                const itemsRemaining = stock - quantity
                // check
                if (itemsRemaining < 0) {
                    throw new Error('Not enough items in stock');
                }
                console.log(`
                -----------------------------------------------------------------------------------
                | ITEMS :${itemsRemaining} | STOCK : ${stock} | QUANTITY : ${quantity}           |
                -----------------------------------------------------------------------------------
                `)
    
    
                // create a cart
                const cart = await this.Cart.create({ createdAt: new Date(), updatedAt: new Date(), UserId: jwt_user_id });
                // create a cartitem
                await this.CartItem.create({ quantity: quantity, CartId: cart?.id, ItemId: item_id });
                // update items stock_quantity
                // await this.Item.update({ stock_quantity: itemsRemaining }, { where: { id : item_id } });
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
    
    
    
    
        // PUT /cart_item/:id  UserId ItemId || update attribute quantity || INCLUDE ITEM
        async updateCartitem(cartId, UserId, quantity) {
            // check if cart_id exist
            const cart = await this.Cart.findOne({
                where: {
                    id: cartId,
                    UserId: UserId
                }
            });
            if (!cart) {
                throw new Error('Cart with a given id not found');
            }
            // update cartitem
            const updatedCartitem = await this.CartItem.update(
                { quantity: quantity },
                {
                    where: { CartId: cartId },
                    include: [{
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
    
    
     */



}




//TODO: Creat user service
module.exports = CatergotyServices;







