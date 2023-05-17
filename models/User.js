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
  },
    {
      timestamps: false,
    }
  );


  User.associate = models => {
    // belongsToMany
    // User.hasOne(models.Role) //, { through: 'UserRoles' },{ timestamps: false, });
    User.belongsToMany(models.Role, { through: 'UserRoles' },{ timestamps: false },);

    // hasOne
    User.hasOne(models.Cart);
    // hasMany
    User.hasMany(models.Order);
    // onDelete: 'CASCADE'
    // User.hasMany(models.Review, { onDelete: 'CASCADE' });
  };
  return User;
};
