
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


    // GET /allcarts This endpoint should only be accessible by the Admin user. This endpoint should return all carts that exist, including the items in those carts and the full names of the users to whom those carts belong. The Sequelize.query() and a raw SQL query MUST be used for this endpoint (Pay attention to the necessary JOINS needed).
    async getAllCarts() {
        return await this.client.query(`
        SELECT Carts.id, 
              Carts.UserId, 
              Carts.totalPrice, 
              Users.firstName, 
              Users.lastName, 
              Items.id, 
              Items.item_name, 
              Items.price, 
              Items.sku, 
              Items.stock_quantity, 
              CartItems.quantity 
        FROM Carts 
        INNER JOIN Users 
        ON Carts.UserId = Users.id 
        INNER JOIN CartItems 
        ON Carts.id = CartItems.CartId 
        INNER JOIN Items 
        ON CartItems.ItemId = Items.id`,
            { type: QueryTypes.SELECT });
    }



    async getCartByUserId(jwt_user_id) {
        return await this.Cart.findAll({
            where: { userId: jwt_user_id },
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





    async addItemToCart_and_ToCartItem_ManagedTransactions(jwt_user_id, item_id, quantity, items_sku) {
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
        const findCartByUserId = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
        if (!findCartByUserId) {
            throw new Error(`Cart with UserId ${jwt_user_id} does not exist`);
        }
        */



        try {

            // find cart where UserId : jwt_user_id
            const findCart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            if (findCart) {
                // find cartItem where CartId and ItemId
                const findCartItem = await this.CartItem.findOne({ where: { CartId: findCart.id, ItemId: item_id } });

                if (findCartItem) {
                    // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
                    if (findAndChoose.stock_quantity < findCartItem.quantity + quantity) {
                        throw new Error(`1 There is not enough stock_quantity for item with id ${item_id}`);
                    }
                    // update cartItem quantity
                    await this.CartItem.update({ quantity: findCartItem.quantity + quantity }, { where: { CartId: findCart.id, ItemId: item_id } });
                    // update cart totalPrice
                    await this.Cart.update({ totalPrice: findCart.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                    // saved
                    await t.commit();
                    return await this.Cart.findOne({ where: { UserId: jwt_user_id } });
                }

                // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
                if (findAndChoose.stock_quantity < quantity) {
                    throw new Error(` 2 There is not enough stock_quantity for item with id ${item_id}`);
                }


                // create cartItem
                await this.CartItem.create({ CartId: findCart.id, ItemId: item_id, quantity: quantity });
                // update cart totalPrice
                await this.Cart.update({ totalPrice: findCart.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                // saved
                await t.commit();
                return await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            }

            // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
            if (findAndChoose.stock_quantity < quantity) {
                throw new Error(`3 There is not enough stock_quantity for item with id ${item_id}`);
            }

            // create cart
            const newCart = await this.Cart.create({ UserId: jwt_user_id, totalPrice: (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity });
            // create cartItem
            await this.CartItem.create({ CartId: newCart.id, ItemId: item_id, quantity: quantity });
            // saved
            await t.commit();
            return await this.Cart.findOne({ where: { UserId: jwt_user_id } });
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }


    async updateItemInCart_and_ToCartItem_ManagedTransactions(jwt_user_id, item_id, item_quantity, items_sku) {
        // start transaction t
        const t = await this.client.transaction();

        try {
            // search user by jwt_user_id and throw error if not found
            const findLoginUser = await this.User.findOne({ where: { id: jwt_user_id } });
            if (!findLoginUser) {
                throw new Error(`User with id ${jwt_user_id} does not exist`);
            }

            // search item_id and throw error if not found
            const find_Item = await this.Item.findOne({ where: { id: item_id } });
            if (!find_Item) {
                throw new Error(`Item with id ${item_id} does not exist`);
            }

            // search items_sku and throw error if not found
            const find_Sku = await this.Item.findOne({ where: { sku: items_sku } });
            if (!find_Sku) {
                throw new Error(`Item with sku ${items_sku} does not exist`);
            }

            const findCart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            if (!findCart) {
                throw new Error(`Cart with UserId ${jwt_user_id} does not exist`);
            }



            // find cartItem where CartId and ItemId
            const findCartItem = await this.CartItem.findOne({ where: { CartId: findCart.id, ItemId: item_id } });
            if (!findCartItem) {
                throw new Error(`CartItem with CartId ${findCart.id} and ItemId ${item_id} does not exist`);
            }

            // CHECK findCartItem.quantity === item_quantity
            if (find_Item.stock_quantity < 0) {
                throw new Error(`There is not enough stock_quantity for item with sku ${items_sku}`);
            }


            if (find_Item.stock_quantity <= 0 || find_Item.stock_quantity < findCartItem.quantity + item_quantity) {
                throw new Error(`There is not enough ${find_Item.item_name}, stock_quantity: ${find_Item.stock_quantity}, your order : ${findCartItem.quantity} ,but want to add: ${item_quantity}`);
            }




            // check if same quantiy exist
            if (findCartItem.quantity === item_quantity) {
                throw new Error(`You already have  ${item_quantity} amounty of ${find_Item.item_name}`);
            }

            //    totalPrice - (findCartItem.quantity * find_Item.price)
            const total_price_minus_cartItem_quantity = findCart.totalPrice - (findCartItem.quantity * find_Item.price);
            // total_price_minus_cartItem_quantity + ( item_quantity * find_Item.price)
            const total_price_plus_cartItem_quantity = total_price_minus_cartItem_quantity + (item_quantity * find_Item.price);


            // UPDATE CART TOTAL PRICE
            await findCart.update({ totalPrice: total_price_plus_cartItem_quantity });
            // UPDATE CARTITEM QUANTITY
            await findCartItem.update({ quantity: item_quantity });

            await t.commit();
            return findCart;
        }

        catch (err) {
            await t.rollback();
            throw err;
        }
    }



    async deleteItemInCart_and_ToCartItem_ManagedTransactions(jwt_user_id, item_id) {
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

        try {
            // find cart where UserId : jwt_user_id
            const findCart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            if (findCart) {
                // find cartItem where CartId and ItemId
                const findCartItem = await this.CartItem.findOne({ where: { CartId: findCart.id, ItemId: item_id } });
                // if cartItem exists
                if (findCartItem) {
                    // delete cartItem where CartId and ItemId
                    await this.CartItem.destroy({ where: { CartId: findCart.id, ItemId: item_id } });
                    // update cart totalPrice
                    await this.Cart.update({ totalPrice: findCart.totalPrice - (findAndChoose.price * findCartItem.quantity) }, { where: { UserId: jwt_user_id } });
                    // saved
                    await t.commit();
                    return await this.Cart.findOne({ where: { UserId: jwt_user_id } });
                }
            }
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }


    // delete-cart/:ItemId
    // DELETE /cart/:id This endpoint should be accessible when a Registered User has logged in. This endpoint should delete all items from the cart of the specific user. The cart id should be used.
    async deleteMyCart(cart_id, jwt_user_id) {
        // start transaction t
        const t = await this.client.transaction();

        // search user by jwt_user_id and throw error if not found
        const findLoginUser = await this.User.findOne({ where: { id: jwt_user_id } });
        if (!findLoginUser) {
            throw new Error(`User with id ${jwt_user_id} does not exist`);
        }

        // search cart_id and throw error if not found
        const findCart = await this.Cart.findOne({ where: { id: cart_id } });
        if (!findCart) {
            throw new Error(`Cart with id ${cart_id} does not exist`);
        }

        try {
            // delete All cartItem where CartId
            await this.CartItem.destroy({ where: { CartId: cart_id } });
            // delete cart where id
            await this.Cart.destroy({ where: { id: cart_id, userId: jwt_user_id } });
            // saved
            await t.commit();
            // return message
            return { message: `All Items for the user ${findLoginUser.firstName}  ${findLoginUser.lastName} has been successfully deleted` };

        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }


    // DELETE all items in the cart
    // async deleteAllItemsInCart_ManagedTransactions(jwt_user_id) {
    //     // start transaction t
    //     const t = await this.client.transaction();

    //     // search user by jwt_user_id and throw error if not found
    //     const findLoginUser = await this.User.findOne({ where: { id: jwt_user_id } });
    //     if (!findLoginUser) {
    //         throw new Error(`User with id ${jwt_user_id} does not exist`);
    //     }

    //     try {
    //         // find cart where UserId : jwt_user_id
    //         const findCart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
    //         if (findCart) {
    //             // delete All cartItem where CartId
    //             await this.CartItem.destroy({ where: { CartId: findCart.id } });
    //             // delete cart where id
    //             await this.Cart.destroy({ where: { id: findCart.id } });
    //             // saved
    //             await t.commit();
    //             // return message
    //             return { message: `Cart for ${ findLoginUser.firstName }  ${ findLoginUser.lastName } has been successfully deleted` };
    //         }
    //     }
    //     catch (err) {
    //         await t.rollback();
    //         throw err;
    //     }
    // }








}

module.exports = CatergotyServices;