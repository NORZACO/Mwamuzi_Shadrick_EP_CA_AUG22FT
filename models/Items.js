module.exports = (sequelize, Sequelize) => {
    const Item = sequelize.define('Item', {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        sku: Sequelize.STRING,
        stock_quantity: Sequelize.INTEGER,
        img_url: Sequelize.STRING
    }, { timestamps: false });

    Item.associate = models => {
        Item.belongsToMany(models.Cart, { through: models.CartItem }, { timestamps: false });

        Item.belongsToMany(models.Order, { through: models.OrderItem }, { timestamps: false });
        Item.belongsTo(models.Category);
    };

    return Item;
};
