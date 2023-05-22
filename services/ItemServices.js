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

    async findOrCreateCategory(categoryName) {
        // Try to find or create the category
        const [categoryInstance, created] = await Category.findOrCreate({
            where: { name: categoryName },
            defaults: { name: categoryName }
        });
        return categoryInstance;
    }

    async createItem(categName, itemImage, itemName, itemPrice, ItemSku, ItemStockQuantity) {
        // Try to find or create the category
        const item = await Item.findOrCreate({
            where: { name: itemName },
            defaults: {
                item_name: itemName,
                img_url: itemImage,
                price: itemPrice,
                sku: ItemSku,
                stock_quantity: ItemStockQuantity,
                categoryId: categName.id
            }
        });
        return item;
    }

    async addItemToCategory(item, category) {
        item.categoryId = category.id;
        await item.save();
        return item;
    }



    async createItemWithCategory(data) {
        const category = await this.findOrCreateCategory(data.category);
        const item = await this.createItem(data, category.id);
        return item;
    }




    async addItemToCart(itemId, userId) {
        return this.CartItem.create({
            itemId: itemId,
            userId: userId
        })
    }





















}
module.exports = ItemServices;





