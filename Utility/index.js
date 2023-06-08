const apiUrl = 'http://143.42.108.232:8888/items/stock'
const axios = require('axios');
const db = require('../models');
// INSERT INTO `stocksalesdb`.`items` (`id`, `item_name`, `price`, `sku`, `stock_quantity`, `img_url`, `CategoryId`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL);

// async function createCategoryIfNotFind()
// https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate
async function createCategoryIfNotFind() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data.data;
        for (const item of items) {
            const [dbCategory, created] = await db.Category.findOrCreate({
                where: { name: item.category },
                defaults: {
                    name: item.category,
                },
            });

            if (!created) {
                await dbCategory.save();

            }
        }

    } catch (error) {
        throw new Error ('Error updating stock:')
    }
}

// create admin



// source https://www.tabnine.com/code/javascript/functions/sequelize/Model/findOrCreate



// // EXPORT updateStock
// module.exports = {
//     updateStock,
//     createCategoryIfNotFind,

// }