const apiUrl = 'http://143.42.108.232:8888/items/stock'
const axios = require('axios');
const db = require('../models');










async function updateItem() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data.data;
        const categories = await db.Category.findAll();
        
        console.log(`
    ------------------------------------------------------------------
    |       UPDATE ITEM TABLE AND ADD CATEGORY FROM API STOCK        |
    ------------------------------------------------------------------
    `)
        
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (items[j].category === categories[i].name) {
                    await db.Item.update({ CategoryId: categories[i].id }, { where: { id: items[j].id } });
                }
            }
        }
        
        console.log(`
    ------------------------------------------------------------------
    |       UPDATE ITEM TABLE AND ADD CATEGORY FROM API STOCK        |
    ------------------------------------------------------------------
    `)
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

updateItem()
