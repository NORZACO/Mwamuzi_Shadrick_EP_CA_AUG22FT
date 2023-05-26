
const { Op, sequelize } = require("sequelize");


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

    // CRUD CART
    async getAllCart() {
        return this.Cart.findAll({
            attributes: ['id', 'createdAt', 'updatedAt', 'UserId'],
            // include: {
            // model: this.CartItem,
            // attributes: ['id', 'cartId', 'itemId', 'quantity'],
            include: {
                model: this.Item,
                attributes: ['id', 'item_name', 'price', 'categoryId']
            }
            // }
        })
    }


    // create quantity, CartId, ItemId and substract stock_quantity
    async addItemToCart(quantity, cartId, itemId) {
        const item = await this.Item.findOne({ where: { id: itemId } })
        if (!item) {
            throw new Error('Item out of stock');
        }

        const cart = await this.Cart.findOne({ where: { id: cartId } })
        if (!cart) {
            throw new Error('Cart not found');
        }
        if (item.stock_quantity < quantity) {
            throw new Error('Item out of stock');
        } 
        const cartItem = await this.CartItem.create({
            quantity: quantity,
            CartId: cartId,
            ItemId: itemId
        })
        await item.update({
            stock_quantity: item.stock_quantity - quantity
        })
        return cartItem;
    }


    //ADD TO CART createdAt, updatedAt, UserId || DONE
    async createCart(userId,  created_at, updated_at) {
        const user = await this.User.findOne({where: {id: userId }})
        if (!user) {
            throw new Error('User not found');
        }
        const cartExist = await this.Cart.findOne({where: {UserId: userId }})
        if (cartExist) {
            throw new Error('User already has a cart');
        }

        const cart = await this.Cart.create({
            createdAt : new Date() || created_at,
            updatedAt : new Date() || updated_at, 
            UserId : userId
        })
        return cart;
    }

    // find user by id || DONE
    async findUserById(id) {
        const user = await this.User.findOne({where: {id: id }})
        return user;
    }


    // find cart by userid || Dx
    // async findCartByUserId(userId) {
    //     const cart = await this.Cart.findOne({where: {UserId: userId }})
    //     return await cart;
    // }


    // add quantity, CartId, ItemId and substract stock_quantity
    async updateItemToCart(quantity, CartId, ItemId) {
        const cart = await this.Cart.findOne({
            where: {
                id: CartId
            }
        })
        const item = await this.Item.findOne({
            where: {
                id: ItemId
            }
        })
        const cartItem = await this.CartItem.findOne({
            where: {
                CartId: CartId,
                ItemId: ItemId
            }
        })
        await cartItem.update({
            quantity: quantity
        })
        await item.update({
            stock_quantity: item.stock_quantity - quantity
        })
        return cartItem;
    }










}

//TODO: Creat user service
module.exports = CatergotyServices;





