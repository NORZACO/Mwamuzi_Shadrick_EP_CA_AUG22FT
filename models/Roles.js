module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
      name: Sequelize.STRING
    },
    { timestamps: false });
  
    Role.associate = models => {
      Role.belongsToMany(models.User, { through: 'UserRoles' },{ timestamps: false },);
      // Role.hasOne(models.User)
    };
  
    return Role;
  };
  

  