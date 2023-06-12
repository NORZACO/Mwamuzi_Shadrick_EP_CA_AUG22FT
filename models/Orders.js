module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        // status
        // https://sebhastian.com/sequelize-enum/#:~:text=Sequelize%20provides%20the%20ENUM%20data%20type%20that%20you,has%20the%20status%20attribute%20that%E2%80%99s%20an%20ENUM%20type%3A
        orderStatus: {
            type: Sequelize.ENUM,
            values: ['pending', 'completed', 'cancelled'], //  "Process" // Process, Complete, Cancelled
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

