// models/CartItems.js

//TODO: Create CartItems model
module.exports = (sequelize, Sequelize) => {
    const CartItems = sequelize.define(
        'CartItems',
        {
            quantity: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    CartItems.associate = function (models) {
        CartItems.belongsTo(models.Cart, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
        CartItems.belongsTo(models.Items, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return CartItems;
}