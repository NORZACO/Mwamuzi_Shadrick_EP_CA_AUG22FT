module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        // status
        orderStatus: {
            type: Sequelize.ENUM,
            values: ['pending', 'completed', 'cancelled'],
            defaultValue: 'pending'
        },

        totalPrice: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },

        // discountCode : {
        //     type: Sequelize.DataTypes.INTEGER,
        //     allowNull: false,
        // },

        discountPercentage: {
            type: Sequelize.DataTypes.INTEGER,
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

