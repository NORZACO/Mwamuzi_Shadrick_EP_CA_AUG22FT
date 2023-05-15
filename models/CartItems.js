module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }

    }, { timestamps: false });

    return CartItem;
};
