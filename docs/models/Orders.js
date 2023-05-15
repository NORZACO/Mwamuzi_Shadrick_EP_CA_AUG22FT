//models/Orders.js

//TODO: Create Orders model
module.exports = (sequelize, Sequelize) => {
    const Orders = sequelize.define(
        'Orders',
        {
            orderNumber: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },

            orderDate: {
                type: Sequelize.DataTypes.DATE,

                allowNull: false,
            },

            orderStatus: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },

            orderTotal: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Orders.associate = function (models) {
        Orders.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
        Orders.belongsTo(models.Items, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return Orders;
}