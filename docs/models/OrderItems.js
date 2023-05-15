//models/OrderItems.js

//TODO: Create OrderItems model
module.exports = (sequelize, Sequelize) => {
    const OrderItems = sequelize.define(
        'OrderItems',
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

    OrderItems.associate = function (models) {
        OrderItems.belongsTo(models.Order, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
        OrderItems.belongsTo(models.Items, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return OrderItems;
}