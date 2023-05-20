
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
            include: {
                model: this.Item,
                attributes: ['id', 'name', 'price', 'categoryId']
            }
        })
    }


    async getCategoryById(id) {
        return this.Category.findAll({
            where: {
                id: id
            },
            attributes: ['id', 'name'],
            include: {
                model: this.Item,
                attributes: ['id', 'name', 'price', 'categoryId']
            }
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


    async deleteCategory(id) {
        return this.Category.destroy({
            where: {
                id: id
            }
        })
    }


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


  




}

//TODO: Creat user service
module.exports = CatergotyServices;





