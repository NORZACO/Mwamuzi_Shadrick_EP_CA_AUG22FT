module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },

        // CartId : {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        // },

    }, { timestamps: false });

    return CartItem;
};
