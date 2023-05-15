// models/Carts.js

//TODO: Create a Carts model
module.exports = (sequelize, Sequelize) => {
    const Carts = sequelize.define(
        'Carts',
        {
            quantity: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Carts.associate = function (models) {
        Carts.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
        Carts.belongsTo(models.Items, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return Carts;
}