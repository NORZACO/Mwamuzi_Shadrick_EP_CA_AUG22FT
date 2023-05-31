module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
        // total: {
        //     type: Sequelize.FLOAT,
        //     allowNull: false,
        // },
    });

    Cart.associate = models => {
        Cart.belongsTo(models.User,    {  foreignKey : 'UserId'  });
        Cart.hasMany(models.CartItem,   {  foreignKey : 'CartId'  });
    };

    return Cart;
};
