module.exports = (sequelize, Sequelize, DataTypes ) => {
    const Item = sequelize.define('Item', {
        item_name : {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price : {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        sku : {
            type: Sequelize.STRING,
            allowNull: false,
        },
        stock_quantity : {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        img_url : {
            type: Sequelize.STRING,
            allowNull: false,
        },
        CategoryId : {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        
    }, { timestamps: false });

    Item.associate = models => {
        Item.belongsToMany(models.Cart, { through: models.CartItem }, { timestamps: false });
        Item.belongsToMany(models.Order, { through: models.OrderItem }, { timestamps: false });
        Item.belongsTo(models.Category, {   foreignKey : 'CategoryId' , timestamps: false });
    };

    return Item;
};

// id, item_name, price, sku, stock_quantity, img_url, CategoryId