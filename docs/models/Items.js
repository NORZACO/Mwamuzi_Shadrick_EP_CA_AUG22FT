// models/Items.js
//TODO: Create items model
module.exports = (sequelize, Sequelize) => {
    const Items = sequelize.define(
        'Items',
        {
            name: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },

            description: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },

            price: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },

            image: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },

            quantity: {
                type: Sequelize.DataTypes.INTEGER,

                allowNull: false,
            },

            category: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Items.associate = function (models) {
        Items.hasMany(models.Cart, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return Items;
}