module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Role', {
    // Role schema
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue : 'Guest'
    },

  }, {
    timestamps: false,
  });

  Role.associate = models => {
    Role.hasMany(models.User, { foreignKey: 'roleId' });
  };

  return Role;
};


