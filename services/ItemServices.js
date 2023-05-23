const { Op, sequelize } = require("sequelize");
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


    async getAllItems() {
        return this.Item.findAll({
            // attributes: ['id', 'item_name', 'price', 'categoryId'],
            include: {
                model: this.Category,
                // attributes: ['id', 'name']
            }
        })
    }


    async getItemById(id) {
        return this.Item.findAll({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'price', 'categoryId'],
            include: {
                model: this.Category,
                attributes: ['id', 'name']
            }
        })
    }


    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate

    // async createCategoryNameIf_idNotExist(categName, itemName, imgUrl, ItemPrice, ItemSku, stockQuantity) {
    //     // find a category name or create a category name
    //     const [ category, created] = await this.Category.findOrCreate({
    //         where: { name: categName },
    //         defaults: {
    //             category: categName,
    //         }
    //     });
    //     // create an item
    //     const item = await this.Item.create({
    //         category  : category.id, // this id was created from populatedf data from noroff api
    //         name: itemName,
    //         price: parseInt(ItemPrice),
    //         sku: ItemSku,
    //         stock_quantity: stockQuantity,
    //         img_url: imgUrl,
    //     });
    //     return item;
    // }

    // async findOrCreateCategory(categoryName) {
    //     // Try to find or create the category
    //     const [categoryInstance, created] = await Category.findOrCreate({
    //         where: { name: categoryName },
    //         defaults: { name: categoryName }
    //     });
    //     return categoryInstance;
    // }
    async createItem(item_name, price, sku, stock_quantity, img_url, CategoryId) {
        const Item = this.Item.create(
            {
                item_name, price, sku, stock_quantity, img_url, CategoryId
            }
        );
        return Item;
    }


    // find by cat ny and return id
    async findCategoryById(id) {
        const catId = await this.Category.findByPk(id);
        return catId.id;
    }


    // find or create category name and return id
    async findOrCreateCategoryName(categoryName) {
        const [categoryInstance, created] = await this.Category.findOrCreate({
            where: { name: categoryName },
            defaults: { name: categoryName }
        });
        if (created) {
            // save
            await categoryInstance.save();
            console.log('Category id have been found and saved');
            return categoryInstance.id;
        }
        return categoryInstance.id;
    }


    // check item by sku, item_name, img_url and return sku, item_name, img_url
    async checkItemBySkuAndItemNameAndImgUrl(itemSku, itemName, imgUrl) {
        const item = await this.Item.findOne({
            where: {
                sku: itemSku,
                item_name: itemName,
                img_url: imgUrl
            },
            attributes: ['sku', 'item_name', 'img_url', 'id']
        });
        return await item;
    }

    // check item by sku OR item_name
    // async checkItemBySkuOrItemName(itemSku, itemName) {
    //     const item = await this.Item.findOne({
    //         where: {
    //             [Op.or]: [
    //                 { sku: itemSku },
    //                 { item_name: itemName }
    //             ]
    //         }
    //     });
    //     return item;
    // }




    


    







    // async addItemToCategory(itemId, categoryId) {
    //     const item = await this.Item.findByPk(itemId);
    //     const category = await this.Category.findByPk(categoryId);
    //     await item.setCategory(category);
    //     return item;
    // }


    // async updateItem(id, item) {
    //     const updatedItem = await this.Item.update(item, {
    //         where: { id: id }
    //     });
    //     return updatedItem;
    // }





















}
module.exports = ItemServices;





