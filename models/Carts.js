module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
       
        totalPrice: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'active'
        },

    });

    Cart.associate = models => {
        Cart.belongsTo(models.User);
        Cart.belongsToMany(models.Item, { through: models.CartItem });
    };

    return Cart;
};
