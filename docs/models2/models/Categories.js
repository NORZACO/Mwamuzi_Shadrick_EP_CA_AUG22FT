// models/Categories.js

//TODO: Create Categories model
module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        'Category',
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            category_name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Category.associate = function (models) {
        Category.hasMany(models.Item, { foreignKey: 'category_id' });
    };

    return Category;
};


