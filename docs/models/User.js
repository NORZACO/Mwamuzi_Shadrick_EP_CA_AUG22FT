// models/User.js
//TODO: create user model
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
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

            roles: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                defaultValue: 'user'
            }
        },
        {
            timestamps: false,
        }
    );

    User.associate = function (models) {
        User.hasMany(models.Cart, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    };

    return User;
};
