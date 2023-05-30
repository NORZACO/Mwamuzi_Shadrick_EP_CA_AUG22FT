
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




    // create cart id, createdAt, updatedAt, UserId
    async createCart(cart_id, created_At, updated_At, User_Id) {
        // check user if exist
        const user = await this.User.findOne({ where: { id: User_Id } });
        if (!user) {
            throw new Error("User not found");
        }
        // check cart if exist
        const cartIxist = await this.Cart.findOne({ where: { id: cart_id } });
        if (cartIxist) {
            throw new Error("Cart already exist");
        }

        const cart = await this.Cart.create({ /*cart_id,*/ created_At, updated_At, User_Id });
        return cart;
    }

    // create cartitem quantity, CartId, ItemId
    async createCartItem(quantity, CartId, ItemId) {
        // check cart if exist
        const cart = await this.Cart.findOne({ where: { id: CartId } });
        if (!cart) {
            throw new Error("Cart not found..");
        }
        // check item if exist
        const item = await this.Item.findOne({ where: { id: ItemId } });
        if (!item) {
            throw new Error("Item not found..");
        }
        // check cartitem if exist, getvallues of stock + quantity, then stock  - quantity
        const cartItemIxist = await this.CartItem.findOne({ where: { CartId: CartId, ItemId: ItemId } });
        if (cartItemIxist) {
            throw new Error("CartItem already exist..");
        }


        const cartItem = await this.CartItem.create({ quantity, CartId, ItemId });
        return cartItem;
    }


    // create Cart, then create cartitem
    // sample htpp post { "quantity": 1, "CartId" : 1, "ItemId" : 129 }
    async createCartAndCartItem(quantity, CartId, ItemId, created_At, updated_At, User_Id) {
        // check user if exist
        const user = await this.User.findOne({ where: { id: User_Id } });
        if (!user) {
            throw new Error("User not found");
        }
        // check cart if exist
        const cartIxist = await this.Cart.findOne({ where: { id: CartId } });
        if (cartIxist) {
            throw new Error("Cart already exist");
        }
        // check item if exist
        const item = await this.Item.findOne({ where: { id: ItemId } });
        if (!item) {
            throw new Error("Item not found..");
        }
        // check cartitem if exist, getvallues of stock + quantity, then stock  - quantity
        const cartItemIxist = await this.CartItem.findOne({ where: { CartId: CartId, ItemId: ItemId } });
        if (cartItemIxist) {
            throw new Error("CartItem already exist..");
        }

        const cart = await this.Cart.create({ /*cart_id,*/ created_At, updated_At, User_Id });
        // const cartItem = await this.CartItem.create({ quantity, cart : cart.id, ItemId });
        return cartItem;
    }


//  quantity, cart : cart.id, ItemId
    // create Cart, then create cartitem
    // sample htpp post { "quantity": 1, "CartId" : 1, "ItemId" : 129 }
    async createCartAndCartItem2(Item_aquantity, cart_Id, ctem_Id) {
        // check user if exist
        const user = await this.User.findOne({ where: { id: User_Id } });
        if (!user) {
            throw new Error("User not found");
        }
        
        // check cart if exist
        const cartIxist = await this.Cart.findOne({ where: { id: cart_Id } });
        if (!cartIxist) {
            throw new Error("Cart does not exist");
        }


        // check item if exist
        const item = await this.Item.findOne({ where: { id: cart_Id } });
        if (!item) {
            throw new Error("Item not found..");
        }


        // check cartitem if exist, getvallues of stock + quantity, then stock  - quantity
        const cartItemIxist = await this.CartItem.findOne({ where: { CartId: cart_Id, ItemId: cart_Id } });
        if (!cartItemIxist) {
            throw new Error("CartItem already exist..");
        }


        // substract stock
        const itemStock = await this.Item.findOne({ where: { id: ctem_Id } });
        if (!itemStock) {
            throw new Error("Item not found..");
        }


        const itemStock2 = itemStock.stock - Item_aquantity;
        const itemStock3 = await this.Item.update({ stock: itemStock2 }, { where: { id: ctem_Id } });
        // const itemStock3 = await this.Item.update({ stock: itemStock2 }, { where: { id: ctem_Id } });



        const cart = await this.Cart.CartItem.create({ quantity: Item_aquantity, cart: cart_Id, ItemId: ctem_Id });
        // const cartItem = await this.CartItem.create({ quantity, cart : cart.id, ItemId });
        return cartItem;
    }





  



}

//TODO: Creat user service
module.exports = CatergotyServices;





