
const { error } = require("jsend");
const { Op, QueryTypes } = require("sequelize");


class SearchService {
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



    // Search a partial item_name  (it does not need to be the full item name)
    // Search for a specific category name
    // Search for a specific SKU (product code)
    // Search for a partial item_name for a specific category name


    // Search a partial item_name  (it does not need to be the full item name)
    async searchItemName(item_name) {
        try {
            const item = await this.Item.findAll({
                where: {
                    item_name: {
                        [Op.like]: `%${item_name}%`
                    }
                }
            });
            return item;
        } catch (error) {
            throw error;
        }
    }


    // Search for a specific category name
    async searchCategoryName(category_name) {
        try {
            const category = await this.Category.findAll({
                where: {
                    category_name: {
                        [Op.like]: `%${category_name}%`
                    }
                }
            });
            return category;

        } catch (error) {
            throw error;
        }
    }


    // Search for a specific SKU (product code)
    async searchItemSku(item_sku) {
        try {
            const item = await this.Item.findAll({
                where: {
                    item_sku: {
                        [Op.like]: `%${item_sku}%`
                    }
                }
            });
            return item;
        } catch (error) {
            throw error;
        }
    }


    // Search for a partial item_name for a specific category name
    async searchItemNameAndCategoryName(item_name, category_name) {
        try {
            const item = await this.Item.findAll({
                where: {
                    item_name: {
                        [Op.like]: `%${item_name}%`
                    }
                },
                include: [{
                    model: this.Category,
                    where: {
                        category_name: {
                            [Op.like]: `%${category_name}%`
                        }
                    }
                }]
            });
            return item;
        } catch (error) {
            throw error;
        }
    }

    // Search for a partial item_name for a specific category name
    async searchItemNameAndCategoryNameAndItemSku(item_name, category_name, item_sku) {
        try {
            const item = await this.Item.findAll({
                where: {
                    item_name: {
                        [Op.like]: `%${item_name}%`
                    },
                    item_sku: {
                        [Op.like]: `%${item_sku}%`
                    }
                },
                include: [{
                    model: this.Category,
                    where: {
                        category_name: {
                            [Op.like]: `%${category_name}%`
                        }
                    }
                }]
            });
            return item;
        } catch (error) {
            throw error;
        }
    }


    // Search for a partial item_name for a specific category name
    async searchItemNameAndItemSku(item_name, item_sku) {
        try {
            const item = await this.Item.findAll({
                where: {
                    item_name: {
                        [Op.like]: `%${item_name}%`
                    },
                    item_sku: {
                        [Op.like]: `%${item_sku}%`
                    }
                }
            });
            return item;
        } catch (error) {
            throw error;
        }
    }





}

module.exports = SearchService;