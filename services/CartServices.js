
const { error } = require("jsend");
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

    /*
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
    
    */

    //  getAllCategories
    async getAllCarts(jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // COUNT CARTS
        // const countCarts = await this.Cart.count();
        // if (await this.Cart.count() === 0) {
        //     throw new Error(`Empy carts`);
        // }

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
            throw new Error(`No Registered Access `);
        }

        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            const allcarts = await this.client.query(`SELECT * FROM allcarts `, { type: QueryTypes.SELECT });
            if (allcarts.length === 0) {
                throw new Error(`Empy carts`);
            }
            return allcarts;
        }
    }





    /*
        async getCartByUserId(jwt_user_role, jwt_user_id) {
            return await this.Cart.findAll({
                where: { userId: jwt_user_role },
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
    */



    // async addItemToCart(jwt_user_id, jwt_user_role) {
    async getCartByUserId(jwt_user_role, jwt_user_id) {
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
            })
        }
    }




    // create addItemToCart jwt_user_role, jwt_user_id, item_id, itemQuantity
    async addItemToCart(jwt_user_role, jwt_user_id, item_id, itemQuantity) {
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
            const cartItem = await this.CartItem.findOne({ where: { ItemId: item.id } });

            // check
            if (cartItem) {
                `${item.quantity} ${cartItem.quantity} + ${itemQuantity}`
                if ((cartItem.quantity + itemQuantity) > item.stock_quantity) {
                    throw new Error(`Out-of-stock`)// ${item.stock_quantity} < ${cartItem.quantity} + ${itemQuantity}`);
                }
            }


            const t = await this.client.transaction();
            // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate
            try {

                // Create or find a cart associated with a user
                const [createNewCart, created] = await this.Cart.findOrCreate({
                    where: { userId: user.id },
                    defaults: {
                        totalPrice: itemQuantity * item.price,
                        status: 'active',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        UserId: user.id
                    }
                });

                // Create or find a cart item associated with the cart and item
                const [createNewCartItem, createdCartItem] = await this.CartItem.findOrCreate({
                    where: { CartId: createNewCart.id, ItemId: item.id },
                    defaults: {
                        quantity: itemQuantity,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        CartId: createNewCart.id,
                        ItemId: item.id
                    }
                });

                // Check if the cart is created or found
                if (created && createdCartItem) {
                    console.log('\n\nNew cart created and new cart item created\n\n');


                } else if (!created && !createdCartItem) {
                    console.log('\n\nExisting cart found and existing cart item found\n\n');
                    // Calculate the updated total price
                    const totalPrice = createNewCart.totalPrice + itemQuantity * item.price;
                    // Update the total price and cart item quantity
                    await createNewCart.update({ totalPrice });
                    await createNewCartItem.update({ quantity: createNewCartItem.quantity + itemQuantity });


                } else if (!created && createdCartItem) {
                    console.log('\n\nExisting cart found and new cart item created\n\n');
                    // Calculate the updated total price
                    const totalPrice = createNewCart.totalPrice + itemQuantity * item.price;
                    // Update the total price and cart item quantity
                    await createNewCart.update({ totalPrice });
                    // await createNewCartItem.update({ quantity: createNewCartItem.quantity + itemQuantity });


                } else {
                    console.log('\n\nUnexpected condition\n\n');
                }




                await t.commit();
                return await this.Cart.findAll(
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






    // update updateItemInCart jwt_user_role, jwt_user_id, item_id, itemQuantity
    async updateItemInCart(jwt_user_role, jwt_user_id, item_id, itemQuantity) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);
        // if user role is not admin
        if (userRole.id === jwt_user_role && userRole.name === 'Admin') {
            throw new Error(`Use your personal acount`);
        }

        // guest
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Login http://127.0.0.1:3000/login`)
        }

        // if user role is registered user
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            // check item
            const item = await this.Item.findByPk(item_id);
            if (!item) {
                throw new Error(`Item with id ${item_id} does not exist`);
            }
            // check item quantity
            if (item.stock_quantity < itemQuantity) {
                throw new Error(`Out-of-stock`);
            }
            // find cart by id
            const cart = await this.Cart.findOne({ where: { userId: user.id } });
            // if cart does not exist
            if (!cart) {
                throw new Error(`Cart does not exist`);
            }
            // find cartItem by cartId and itemId
            const cartItem = await this.CartItem.findOne({ where: { CartId: cart.id, ItemId: item.id } });
            // if cartItem does not exist
            if (!cartItem) {
                throw new Error(`Item with id ${item_id} does not exist in cart`);
            }

            // remove quantity from totalPrice
            const remove_quantity = cart.totalPrice - (cartItem.quantity * item.price)
            // calculate new 
            const new_totalPrice = remove_quantity + (itemQuantity * item.price)
            console.log(`PRICE: ${item.price}\nREMOVE: ${remove_quantity}\nQUANTITY: ${cartItem.quantity}\n`);


            const checking_json = {
                quantity: cartItem.quantity,
                price: item.price,
                cartitem_total_price: cartItem.quantity * item.price,
                Cart_totalPrices: cart.totalPrice,

                new_cart_total: new_totalPrice,

                New_price: itemQuantity * item.price
            }

            // update cartItem quantity
            const update_cartItem = await this.CartItem.update(
                { quantity: itemQuantity },
                { where: { CartId: cart.id, ItemId: item.id } }
            );
            // update cart totalPrice
            const update_cart = await this.Cart.update(
                { totalPrice: new_totalPrice },
                { where: { id: cart.id } }
            );
            // return checking_json
            return await this.Cart.findAndCountAll(
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
            )
        }
    }





    async deleteItemInCart(jwt_user_role, jwt_user_id, item_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);
        // if user role is not admin
        if (userRole.id === jwt_user_role && userRole.name === 'Admin') {
            throw new Error(`Use your personal acount`);
        }

        // guest
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Login http://127.0.0.1:3000/login`)
        }

        // if user role is registered user
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            // check item
            const item = await this.Item.findByPk(item_id);
            if (!item) {
                throw new Error(`Item with id ${item_id} does not exist`);
            }
            // find cart by id
            const cart = await this.Cart.findOne({ where: { userId: user.id } });
            // if cart does not exist
            if (!cart) {
                throw new Error(`Cart does not exist`);
            }
            // find cartItem by cartId and itemId
            const cartItem = await this.CartItem.findOne({ where: { CartId: cart.id, ItemId: item.id } });
            // if cartItem does not exist
            if (!cartItem) {
                throw new Error(`Item with id ${item_id} does not exist in cart`);
            }


            // remove quantity from totalPrice
            const remove_quantity = cart.totalPrice - (cartItem.quantity * item.price)
            // calculate new 
            console.log(`PRICE: ${item.price}\nREMOVE: ${remove_quantity}\nQUANTITY: ${cartItem.quantity}\n`);

            // update cart totalPrice
            const update_cart = await this.Cart.update(
                { totalPrice: remove_quantity },
                { where: { id: cart.id } }
            );
            // delete cartItem
            const delete_cartItem = await this.CartItem.destroy({ where: { CartId: cart.id, ItemId: item.id } });
            // return cartItem
            return cartItem;
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