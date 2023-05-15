//models/Orders.js

//TODO: Create Orders model
module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        'Order',
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            order_status: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                defaultValue: "Pending"
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

    Order.associate = function (models) {
        Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
    };

    return Order;
};
