'use strict';

const apiUrl = 'http://143.42.108.232:8888/items/stock'
const axios = require('axios');
const bcrypt = require(`bcrypt`);


const first_name = 'Mwamuzi';
const last_name = 'Shadrick';
const user_name = 'Admin';
const user_email = 'adminIKT@gmail.com';
const encrypted_passorde = `P@ssword2023`

class UtilityServices {
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


    async Utilityprepopulation() {
        const countItem = await this.Item.count();

        if (countItem > 0) {
            console.log(`
    -----------------------------------------
    | YOU CAN ONLY RUN SETUP  ONCE || ${countItem}    |
    -----------------------------------------
    `)
            throw new Error(` ${countItem} Items already exist`);
        }

        await this.Role.create({ name: 'Admin' });
        await this.Role.create({ name: 'User' });
        // await this.Role.create({ name: 'Member' });
        await this.Role.create({ id: 'guest-user-68ea5cbf-60f0-4113-8d29-f', name: 'Guest' });
        // await this.Role.create({ name: 'Paid_member' });

        try {
            // checking if items table already have items
            const countItem = await this.Item.findAll();

            if (countItem > 0) {
                return res.status(400).jsend.fail({ 'result': 'Items already exist' });
            }

            // fetch id, item_name, price, sku, stock_quantity, img_url, CategoryId.id data from school stock Api
            const response = await axios.get(apiUrl);
            const items = response.data.data;



            for (const item of items) {
                const [dbCategory, created] = await this.Category.findOrCreate({
                    where: { name: item.category },
                    defaults: {
                        name: item.category,
                    },
                });

                if (!created) {
                    await dbCategory.save();

                }
            }




            // inserting items to db
            for (const item_from_api of items) {
                await this.Item.create({
                    id: item_from_api.id,
                    item_name: item_from_api.item_name,
                    price: item_from_api.price,
                    sku: item_from_api.sku,
                    stock_quantity: item_from_api.stock_quantity,
                    img_url: item_from_api.img_url,
                    CategoryId: null
                });
            }


            // get role id of admin
            const role_UUIDV4 = await this.Role.findOne({
                where: {
                    name: 'Admin'
                }
            });


            // role id
            const role_Id = role_UUIDV4.id;

            const salt = await bcrypt.genSalt(10);
            const encryptedPassorde = await bcrypt.hash(encrypted_passorde, salt);
            await this.User.create({
                firstName: first_name,
                lastName: last_name,
                username: user_name,
                email: user_email,
                encryptedPassword: encryptedPassorde,
                roleId: role_Id
            });


            return this.User.findOne(
                {
                    where: {
                        email: user_email
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: this.Role,
                            // name as codez
                            attributes: ['id', 'name']
                        }
                    ]
                }
            )


        } catch (error) {
            // await t.rollback();
            throw new Error(error);
        }
    }




    async updateItem() {
        try {
            const response = await axios.get(apiUrl);
            const items = response.data.data;
            const categories = await this.Category.findAll();

            console.log(`
    ------------------------------------------------------------------
    |       UPDATE ITEM TABLE AND ADD CATEGORY FROM API STOCK        |
    ------------------------------------------------------------------
    `)
            const categoriesLength = categories.length

            for (let i = 0; i < categoriesLength; i++) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].category === categories[i].name) {
                        await this.Item.update({ CategoryId: categories[i].id }, { where: { id: items[j].id } });
                    }
                }
            }


            return this.User.findOne(
                {
                    where: {
                        email: user_email
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: this.Role,
                            // name as codez
                            attributes: ['id', 'name']
                        }
                    ]
                }
            )

        } catch (error) {
            console.error('Error updating stock:', error);
        }
    }

}













module.exports = UtilityServices;






