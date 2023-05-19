// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define('User', {
//       name: Sequelize.STRING,
//       email: Sequelize.STRING,
//       password: Sequelize.STRING
//     });

//     User.associate = models => {
//       User.belongsToMany(models.Role, { through: 'UserRoles' });
//       User.hasOne(models.Cart);
//       User.hasMany(models.Order);
//     };

//     return User;
//   };


module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    username: {
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

    roleId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

  },
    {
      timestamps: false,
    }
  );


  // User.associate = models => {
  //   User.hasOne(models.Cart);
  //   User.hasMany(models.Order);
  //   User.belongsTo(models.Role, { targetKey: 'roleId', timestamps: false });
  // };


  User.associate = models => {
    User.hasOne(models.Cart);
    User.hasMany(models.Order);
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };


  return User;
};
