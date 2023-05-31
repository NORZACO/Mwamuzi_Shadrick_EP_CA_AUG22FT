module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        // status
        status: {
            type: Sequelize.ENUM,
            values: ['pending', 'completed', 'cancelled'],
            defaultValue: 'pending'
        },

        totalPrice : {
            type: Sequelize.FLOAT,
            allowNull: false,
        },

        Ordered_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },

    { timestamps: false });

    Order.associate = models => {
        Order.belongsTo(models.User);
        Order.belongsToMany(models.Item, { through: models.OrderItem });
    };

    return Order;
};
