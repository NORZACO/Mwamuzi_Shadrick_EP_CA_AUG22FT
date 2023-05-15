module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        order_date: {
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
