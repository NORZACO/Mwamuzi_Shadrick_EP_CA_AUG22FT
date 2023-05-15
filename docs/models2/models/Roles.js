// models/Roles.js
module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define(
        'Role',
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role_name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Role.associate = function (models) {
        Role.hasMany(models.User, { foreignKey: 'role_id' });
    };

    return Role;
};
