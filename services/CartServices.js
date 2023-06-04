
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
                    await this.CartItem.update({ quantity: findCartItem.quantity + quantity }, {
                        where: { CartId: findCart.id, ItemId: item_id }
                    });

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


    async updateItemInCart_and_ToCartItem_ManagedTransactions(jwt_user_id, item_id, quantity, items_sku) {
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


        // CHECK IF THERE IS ENOUGH STOCK_QUANTITY
        if (findAndChoose.stock_quantity < quantity) {
            throw new Error(`There is not enough stock_quantity for item with id ${item_id}`);
        }

        try {
            // find cart where UserId : jwt_user_id
            const findCart = await this.Cart.findOne({ where: { UserId: jwt_user_id } });
            if (findCart) {
                // find cartItem where CartId and ItemId
                const findCartItem = await this.CartItem.findOne({ where: { CartId: findCart.id, ItemId: item_id } });
                if (findCartItem) {
                    // update cartItem quantity
                    await this.CartItem.update({ quantity: quantity }, {
                        where: { CartId: findCart.id, ItemId: item_id }
                    });

                    // update cart totalPrice
                    await this.Cart.update({ totalPrice: findCart.totalPrice + (await this.Item.findOne({ where: { sku: items_sku } })).price * quantity }, { where: { UserId: jwt_user_id } });
                    // saved
                    await t.commit();
                    return await this.Cart.findOne({ where: { UserId: jwt_user_id } });
                }
                // if cartItem not found
                throw new Error(`CartItem with CartId ${findCart.id} and ItemId ${item_id} does not exist`);
                }
            // if cart not found
            throw new Error(`Cart with UserId ${jwt_user_id} does not exist`);
            







}

module.exports = CatergotyServices;