const axios = require('axios');
const db = require('../models');

async function updateStock() {
    try {
        const response = await axios.get('http://143.42.108.232:8888/items/stock');
        const items = response.data.data;

        for(let item of items){
            const [dbItem, created] = await db.Item.findOrCreate({
                where: { sku: item.sku },
                defaults: {
                    item_name: item.item_name,
                    price: item.price,
                    stock: item.stock_quantity,
                    category_id: await getCategoryId(item.category)
                }
            });

            if(!created){
                dbItem.stock = item.stock_quantity;
                await dbItem.save();
            }
        }

        console.log("Stock updated successfully");
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

async function getCategoryId(categoryName){
    const category = await db.Category.findOne({ where: { category_name: categoryName } });
    return category ? category.id : null;
}

updateStock();
