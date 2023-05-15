// models/CartItems.js

//TODO: Create CartItems model
// models/CartItem.js
module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define(
        'CartItem',
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            cart_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            item_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },
        {
            timestamps: false,
        }
    );

    CartItem.associate = function (models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
        CartItem.belongsTo(models.Item, { foreignKey: 'item_id', as: 'item' });
    };

    return CartItem;
};
