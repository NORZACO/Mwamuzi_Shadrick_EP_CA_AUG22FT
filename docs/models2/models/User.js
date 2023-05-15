// models/User.js
//TODO: create user model

// models/User.js
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            encryptedPassword: {
                type: Sequelize.DataTypes.BLOB,
                allowNull: false,
            },
            salt: {
                type: Sequelize.DataTypes.BLOB,
                allowNull: false,
            },
            role_id: {
                type: Sequelize.DataTypes.INTEGER,
            }
        },
        {
            timestamps: false,
        }
    );

    User.associate = function (models) {
        User.hasMany(models.Cart, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
    };

    return User;
};
