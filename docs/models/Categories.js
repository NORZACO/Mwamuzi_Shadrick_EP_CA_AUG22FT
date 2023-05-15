// models/Categories.js

//TODO: Create Categories model
module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define(
        'Categories',
        {
            name: {
                type: Sequelize.DataTypes.STRING,

                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Categories.associate = function (models) {
        Categories.hasMany(models.Items, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return Categories;
}



// Path: models\Cart.js
// export
