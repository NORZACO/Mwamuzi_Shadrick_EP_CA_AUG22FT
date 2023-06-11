const db = require('../models');
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");



// create 10 roles
async function createRole() {
    try {
        const roles = await db.Role.findAll();
        const rolesLength = roles.length
        if (rolesLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ROLES, ID, NAME, CREATEDAT, UPDATEDAT           |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.Role.create({ name: `role${i}` })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ROLES, ID, NAME, CREATEDAT, UPDATEDAT           |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating role:', error);
    }
}


async function createcATEGORY() {
    try {
        const roles = await db.Category.findAll();
        const rolesLength = roles.length
        if (rolesLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ROLES, ID, NAME, CREATEDAT, UPDATEDAT           |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.Category.create({ name: `category-B00${i}` })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ROLES, ID, NAME, CREATEDAT, UPDATEDAT           |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating role:', error);
    }
}



// create 10 users
async function createUser() {
    try {
        const users = await db.User.findAll();
        const usersLength = users.length
        if (usersLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 USERS, ID, NAME, EMAIL, PASSWORD, CREATEDAT,    |
    |       UPDATEDAT                                                 |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.User.create({
                    username: `bruker${i}`, 
                    email: `user${i}@gmail.com`, 
                    encryptedPassword: `pas###password${i}`,
                    roleId: i+1
                })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 USERS, ID, NAME, EMAIL, PASSWORD, CREATEDAT,    |
    |       UPDATEDAT                                                 |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
}


// create id, item_name, price, sku, stock_quantity, img_url, CategoryId
async function createItem() {
    try {
        const items = await db.Item.findAll();
        const itemsLength = items.length
        if (itemsLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ITEMS, ID, ITEM_NAME, PRICE, SKU,               |
    |       STOCK_QUANTITY, IMG_URL, CATEGORYID, CREATEDAT,           |
    |       UPDATEDAT                                                 |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.Item.create({
                    item_name: `item${i}`,
                    price: i * 100,
                    sku: `SKU${i}`,
                    stock_quantity: i * 10,
                    img_url: `http://example.com/image${i}.JPG`,
                    CategoryId: i + 1
                })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 ITEMS, ID, ITEM_NAME, PRICE, SKU,               |
    |       STOCK_QUANTITY, IMG_URL, CATEGORYID, CREATEDAT,           |
    |       UPDATEDAT                                                 |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating item:', error);
    }
}


// create CARTS:  id, createdAt, updatedAt, UserId
async function createOrder() {
    try {
        const carts = await db.Cart.findAll();
        const cartsLength = carts.length
        if (cartsLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 CARTS, ID, CREATEDAT, UPDATEDAT, USERID         |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.Cart.create({
                    // createdAt, updatedAt, UserId
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    UserId: i + 1
                })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 CARTS, ID, CREATEDAT, UPDATEDAT, USERID         |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating cart:', error);
    }
}


// create CART_ITEMS: quantity, CartId, ItemId
async function createOrderItem() {
    try {
        const cartItems = await db.CartItem.findAll();
        const cartItemsLength = cartItems.length
        if (cartItemsLength > 0) {
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 CART_ITEMS, QUANTITY, CARTID, ITEMID            |
    ------------------------------------------------------------------
    `)
        } else {
            for (let i = 0; i < 10; i++) {
                await db.CartItem.create({
                    quantity: Math.floor(Math.random() * i * 13),
                    CartId: i + 1,
                    ItemId: i + 1
                })
            }
            console.log(`
    ------------------------------------------------------------------
    |       CREATE 10 CART_ITEMS, QUANTITY, CARTID, ITEMID            |
    ------------------------------------------------------------------
    `)
        }
    } catch (error) {
        console.error('Error creating cartItem:', error);
    }
}


    


// call funcs
createcATEGORY();
createRole();
// createcATEGORY();
setTimeout(() => {createUser();}, 2000);
setTimeout(() => {createItem();}, 4000);
setTimeout(() => {createOrder();}, 6000);
setTimeout(() => {createOrderItem();}, 8000);





