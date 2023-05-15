module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {});

    Cart.associate = models => {
        Cart.belongsTo(models.User);
        Cart.belongsToMany(models.Item, { through: models.CartItem });
    };

    return Cart;
};
