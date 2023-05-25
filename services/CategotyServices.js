
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


    async getAllCategories() {
        return this.Category.findAll({
            attributes: ['id', 'name'],
            // include: {
            //     model: this.Item,
            //     // attributes: ['categoryId']
            // }
        })
    }

    // getCategoryName
    async getCategoryName(categName, categId) {
        const categoryName = await this.Category.findOne(
            {
                where: {
                    name: categName,
                    id: categId
                }
            })
        return await categoryName
    }

    // getCategoryById
    async getCategoryById(id) {
        return this.Category.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'name'],
            // include: {
            //     model: this.Item,
            //     attributes: ['id', 'name', 'price', 'categoryId']
            // }
        })
    }


    async createCategory(categName) {
        return this.Category.create({
            name: categName
        })
    }


    async updateCategory(id, categName) {
        return this.Category.update({
            name: categName
        }, {
            where: {
                id: id
            }
        })
    }


    async deleteCategoryWithNoItems(id) {
        return this.Category.destroy({
            where: {
                id: id
            }
        })
    }

    //deleteCategory before delete hook
    async deleteCategory(id) {
        const category = await this.Category.findByPk(id)
        if (!category) {
            throw new Error('Category with given id not found');
        }

        // item count
        const itemCount = await this.Item.count({
            where: {
                categoryId: id
            }
        });
        if (itemCount > 0) {
            throw new Error('Category has items');
        }
        return category.destroy();
    }




    //




    // getCategoryByName
    async getCategoryByName(name) {
        return this.Category.findAll({
            where: {
                name: name
            },
            attributes: ['id', 'name'],
            include: {
                model: this.Item,
                attributes: ['id', 'name', 'price', 'categoryId']
            }
        })
    }





    //   getCategoryByname
    //   async getCategoryByname(name) {
    //     return this.Category.findAll({
    //       where: {
    //         name: name
    //       },
    //       attributes: ['id', 'name'],
    //       include: {
    //         model: this.Item,
    //         attributes: ['id', 'item_name', 'price', 'categoryId']
    //       }
    //     })




}

//TODO: Creat user service
module.exports = CatergotyServices;





