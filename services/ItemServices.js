const { Op, sequelize } = require("sequelize");
require('dotenv').config()


const adminView = process.env.ACCESS_Admin_TOKEN;
const guestView = process.env.ACCESS_Guest_TOKEN;
const registerView = process.env.ACCESS_Register_TOKEN;




class ItemServices {
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


    // async getAllItems() {
    //     return this.Item.findAll({
    //         attributes: [['item_name', 'product'], ['stock_quantity', 'In-stock'], 'price',],
    //         include: {
    //             model: this.Category,
    //             attributes: ['name']
    //         }
    //     })
    // }




    // show only item price if user role is Guest and show item stock if user role is admin
    async getAllItemsByUser(jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);

        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            return await this.Item.findAll({
                where: {
                    stock_quantity: {
                        [Op.gt]: 0
                    }
                },
                attributes: ['id',['item_name', `${guestView}`], 'price', ['stock_quantity', 'In-stock'], 'sku', ['img_url', 'image']],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            });
        }




        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            return this.Item.findAll({
                attributes: ['id',['item_name', `${registerView}`], 'price', ['stock_quantity', 'In-stock'], 'sku', 'img_url'],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            })
        }

        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            return this.Item.findAll({
                attributes: ['id',['item_name', `${adminView}`], 'price', ['stock_quantity', 'In-stock'], 'sku', 'img_url'],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            })
        }
    }


    /// create Item || POST /item This endpoint should only be accessible as an Admin User.
    async createItem(item_name, price, sku, stock_quantity, img_url, CategoryId, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);
        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Access denied.Only admin allowed here`)
        }
        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error(`Access denied. Only admin allowed here`)
        }
        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            const Item = await this.Item.findOne({
                where: {
                    [Op.or]: [
                        // { id: itemId },
                        { item_name: item_name },
                        // { price: price },
                        { sku: sku },
                        // { stock_quantity: stock_quantity },
                        { img_url: img_url }
                        // { CategoryId: CategoryId }
                    ]
                }
            });
            if (Item) {
                throw new Error(
                    `Item name "${item_name}"  already exist`
                );
            }
            // check CategoryId if exist
            const category = await this.Category.findOne({
                where: {
                    id: CategoryId
                }
            });
            if (!category) {
                throw new Error(
                    `Category with id: ${CategoryId} does not exist`
                );
            }
            return await this.Item.create({
                item_name,
                price,
                sku,
                stock_quantity,
                img_url,
                CategoryId
            });
        }
    }




    // GET ITEM BY JWT USER ID OR JWT ROLE
    async getItemByPK(itemPK, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        const item = await this.Item.findByPk(itemPK);
        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);
        // Guest user

        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            // show name and price and picture
            return this.Item.findByPk(itemPK, {
                attributes: [['item_name', `${guestView}`], 'price', 'img_url'],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            })
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            // show name and price and picture
            return this.Item.findByPk(itemPK, {
                attributes: [['item_name', `${registerView}`], 'price', 'img_url'],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            })
        }
        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            // show name and price and picture
            return this.Item.findByPk(itemPK, {
                attributes: [['item_name', `${adminView}`], 'price', 'img_url'],
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            })
        }
    }



    // UPADTE
    async updateItem(itemId, item_name, price, sku, stock_quantity, img_url, CategoryId, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Access denied.Only admin allowed here`)
        }
        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error(`Access denied. Only admin allowed here`)
        }


        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            // transaction t
            const t = await this.client.transaction();
            try {
                const item = await this.Item.findByPk(itemId)
                const cat = await this.Category.findByPk(CategoryId)

                if (!cat) {
                    throw new Error(
                        `Category with id: ${CategoryId} does not exist`
                    );
                }
                if (!item) {
                    throw new Error(
                        `Item with id: ${itemId} does not exist`
                    );
                }

                // check sku AND img_url AND item_name
                const itemExist = await this.Item.findOne({
                    where: { item_name, price, sku, stock_quantity, img_url, CategoryId }
                });

                if (itemExist) {
                    throw new Error(`The Item "${item_name}" already exist`);
                }

                // update Item
                const itemUpdate = await this.Item.update({
                    item_name,
                    price,
                    sku,
                    stock_quantity,
                    img_url,
                    CategoryId
                }, {
                    where: {
                        id: itemId
                    }
                }, { transaction: t });

                // check count Items with same sku
                const countItems = await this.Item.count({
                    where: {
                        sku
                    }
                }, { transaction: t });

                // if countItems > 1 rollback
                if (countItems > 1) {
                    throw new Error(`Invalid code: ${sku}. Already taken`);
                }

                // check count Items with same name
                const countItemsName = await this.Item.count({
                    where: {
                        item_name
                    }
                }, { transaction: t });
                // if countItemsName > 1 rollback
                if (countItemsName > 1) {
                    throw new Error(`The name "${item_name}" have already taken`);
                }

                // check count Items with same img_url
                const countItemsImg = await this.Item.count({
                    where: {
                        img_url
                    }
                }, { transaction: t });
                // if countItemsImg > 1 rollback
                if (countItemsImg > 1) {
                    throw new Error(`The image name "${img_url}" aready been taken`);
                }

                // commit
                await t.commit();
                return `Succefully updated`;
            } catch (error) {
                // rollback
                await t.rollback();
                throw error;
            }
        }
    }


    

    // POST DELETE
    async deleteItem(item_id, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Access denied.Only admin allowed here`)
        }
        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error(`Access denied. Only admin allowed here`)
        }

        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            const t = await this.client.transaction();
            try {
                const item = await this.Item.findByPk(item_id);
                if (!item) {
                    throw new Error(`Item with id: ${item_id} does not exist`);
                }
                await this.Item.destroy({
                    where: {
                        id: item_id
                    }
                }, { transaction: t });
                await t.commit();
                return `Item with id: ${item_id} was deleted`;
            } catch (error) {
                await t.rollback();
                throw new Error(error);
            }
        }
    }


}
module.exports = ItemServices;





