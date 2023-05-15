// models/Carts.js

//TODO: Create a Carts model
// models/Cart.js
module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define(
        'Cart',
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

    Cart.associate = function (models) {
        Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
    };

    return Cart;
};

