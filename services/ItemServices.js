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




    async getItemByPK(itemPK) {
        const item = await this.Item.findByPk(itemPK
            , {
                include: {
                    model: this.Category,
                    attributes: ['name']
                }
            }

        )
        if (!item) {
            throw new Error(`Item with id: ${itemPK} not found`)
        }
        return item
    }




    // Check item by  item_name, price, sku, stock_quantity, img_url, CategoryId
    async createItem(Item_name, price, sku, stock_quantity, img_url, CategoryId) {
        // const ItemSeack by itemId    OR item_name OR  price OR sku OR stock_quantity OR img_url OR CategoryId
        const Item = await this.Item.findOne({
            where: {
                [Op.or]: [
                    // { id: itemId },
                    { item_name: Item_name },
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
                `Item with item_name: ${Item_name} or sku ${sku} or img_url ${img_url} already exist`
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

        const NewItem = await this.Item.create(
            { item_name: Item_name, price: price, sku: sku, stock_quantity: stock_quantity, img_url: img_url, CategoryId: CategoryId });
        // await t.commit();
        return NewItem;
    }





    // UPDATE
    async updateItem(itemId, item_name, price, sku, stock_quantity, img_url, CategoryId) {
        // const ItemSeack by itemId    OR item_name OR  price OR sku OR stock_quantity OR img_url OR CategoryId
        const Item = await this.Item.findByPk(itemId)
        const cat = await this.Category.findByPk(CategoryId)
        if (!cat) {
            throw new Error(
                `Category with id: ${CategoryId} does not exist`
            );
        }

        if (!Item) {
            throw new Error(
                `Item with id: ${itemId} does not exist`
            );
        }
        // check sku AND img_url AND item_name        
        const itemExist = await this.Item.findOne({
            where: {
                sku: sku,
                img_url: img_url,
                item_name: item_name
            }
        });

        if (itemExist) {
            throw new Error(
                `Item with sku: ${sku} or img_url: ${img_url} or item_name: ${item_name} already exist`
            );
        }
        const t = await this.client.transaction();
        try {

            const item = await this.Item.update({
                item_name: item_name,
                price: price,
                sku: sku,
                stock_quantity: stock_quantity,
                img_url: img_url,
                CategoryId: CategoryId
            },
                { where: { id: itemId } }
            );
            await t.commit();
            return item;
        } catch (error) {
            await t.rollback();
            throw new Error(error);
        }
    }






    // delete
    async deleteItem(id) {
        const item = await this.Item.destroy({
            where: { id: id }
        });
        return item;
    }






}
module.exports = ItemServices;





