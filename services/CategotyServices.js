
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


    //  getAllCategories
    async getAllCategories(jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            return await await this.Category.findAll(
                { attributes: ['id', 'name'] }
            )
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            return await this.Category.findAll({
                attributes: ['id', 'name'],
            })
        }
        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            return await this.Category.findAll({
                attributes: ['id', 'name'],
                // include: {
                //     model: this.Item,
                //     attributes: ['id', 'name', 'price', 'categoryId']
                // }
            })
        }
    }

    //  getAllCategories
    async getCategoryById(categoryId, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);


        const existCat = await this.Category.findByPk(categoryId)
        if (!existCat) {
            throw new Error('Category does not exist');
        }


        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            return await this.Category.findByPk(categoryId)
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            return await this.Category.findByPk(categoryId)
        }
        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            return await this.Category.findByPk(categoryId)
        }
    }


    // create category using findOcreate
    async createCategory(categoryName, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);


        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error('Guest user cannot create category');
        }

        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error('Registered user cannot create category');
        }
        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            const [dbCategory, created] = await this.Category.findOrCreate({
                where: { name: categoryName },
                defaults: {
                    name: categoryName,
                },
            });

            if (!created) {
                await dbCategory.save();
            }
            return dbCategory;
        }
    }
















    // UPADTE
    async updateCategory(CategoryId, categoryName, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Access denied`)
        }
        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error(`Access denied`)
        }


        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            // transaction t
            const t = await this.client.transaction();
            try {
                const cat = await this.Category.findByPk(CategoryId)

                if (!cat) {
                    throw new Error(`Category with id: ${CategoryId} does not exist`);
                }

                // find where name
                const existCategory = await this.Category.findOne({
                    where: {
                        name: categoryName
                    }
                }, { transaction: t });
                if (existCategory) {
                    throw new Error(` ${categoryName} already exist`);
                }

                // update Item
                const itemUpdate = await this.Category.update({
                    name: categoryName
                }, {
                    where: {
                        id: CategoryId
                    }
                }, { transaction: t });

                // check count Items with same sku
                const countCategory = await this.Category.count({
                    where: {
                        name: categoryName
                    }
                }, { transaction: t });

                // if countItems > 1 rollback
                if (countCategory > 1) {
                    throw new Error(`Invalid name: ${categoryName}. Already taken`);
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






















    async deleteCategoryWithNoItems(cat_id) {
        return this.Category.destroy({
            where: {
                id: cat_id
            }
        })
    }

    //deleteCategory before delete hook
    async deleteCategory(category_Id, jwt_user_role, jwt_user_id) {
        // LOG
        console.log(`jwt_user_role: ${jwt_user_role}`);
        console.log(`jwt_user_id: ${jwt_user_id}`);

        // find user role by id
        const userRole = await this.Role.findByPk(jwt_user_role);
        // find user by id
        const user = await this.User.findByPk(jwt_user_id);

        // Guest user
        if (userRole.id === jwt_user_role && userRole.name === 'Guest') {
            throw new Error(`Access denied`)
        }
        // Registered
        if (userRole.id === user.roleId && userRole.name === 'Registered') {
            throw new Error(`Access denied`)
        }

        // Admin
        if (userRole.id === user.roleId && userRole.name === 'Admin') {
            // transaction t
            const t = await this.client.transaction();
            try {
                const cat = await this.Category.findByPk(category_Id)

                if (!cat) {
                    throw new Error(`Category with id: ${category_Id} does not exist`);
                }


                const itemCount = await this.Item.count({
                    where: {
                        categoryId: category_Id
                    }
                });

                if (itemCount > 0) {
                    throw new Error('Category has items, thus cannot be deleted');
                }


                // delete Item
                await this.Category.destroy({
                    where: {
                        id: category_Id
                    }
                }, { transaction: t });



                // commit
                await t.commit();
                return `Succefully deleted`;
            } catch (error) {
                // rollback
                await t.rollback();
                throw error;
            }
        }
    }









}

//TODO: Creat user service
module.exports = CatergotyServices;





