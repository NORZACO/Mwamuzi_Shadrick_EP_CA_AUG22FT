const apiUrl = 'http://143.42.108.232:8888/items/stock'
const axios = require('axios');
const db = require('../models');
// INSERT INTO `stocksalesdb`.`items` (`id`, `item_name`, `price`, `sku`, `stock_quantity`, `img_url`, `CategoryId`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL);
async function updateStock() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data.data;

        for (let item of items) {
            const [dbItem, created] = await db.Item.findOrCreate({
                where: { sku: item.sku },
                defaults: {
                    // category : ,
                    id: item.id,
                    img_url: item.img_url,
                    item_name: item.item_name,
                    price: item.price,
                    sku: item.sku,
                    stock_quantity: item.stock_quantity,
                    // categoryId: item.category
                },
                
            });

            if (!created) {
                dbItem.stock = item.stock_quantity;
                await dbItem.save();
            }

        }
       // LOGO
        console.log(`
    ------------------------------------------------------------------
    |       UPDATE ITEM TABLE AND ADD CATEGORY FROM API STOCK        |
    ------------------------------------------------------------------
    `)
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}





// async function createCategoryIfNotFind()
async function createCategoryIfNotFind() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data.data;
        for (let item of items) {
            const [dbCategory, created] = await db.Category.findOrCreate({
                where: { name: item.category },
                defaults: {
                    name: item.category,
                    // id : item.id,
                }, // include
            });

            if (!created) {
                //update  category id to item column CategoryId
                // const dbItem = await db.Item.findAll({ where: { name: item.item_name } });
                await dbCategory.save();

            }
        }
        console.log("Stock updated successfully");
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}



// async function createCategory(categName) {
//     return this.Item.update({ CategoryId: categName }
//         , { where: { CategoryId: item.item_name } }
//     )
// }

// createCategoryIfNotFind()
// updateStock();
// updateItem();
// getCategoryName()
// source https://www.tabnine.com/code/javascript/functions/sequelize/Model/findOrCreate



// EXPORT updateStock
module.exports = {
    updateStock,
    createCategoryIfNotFind,

}