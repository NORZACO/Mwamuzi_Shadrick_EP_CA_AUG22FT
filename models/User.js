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



    firstName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },


    lastName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },


    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },


    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },

    encryptedPassword: {
      type: Sequelize.DataTypes.BLOB,

      allowNull: false,
    },

    // role id  uuid
    roleId: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    

    // roleId: {
    //   type: Sequelize.DataTypes.INTEGER,
    //   allowNull: false,
    //   // defaultValue: 2
    // },

  },
    {
      timestamps: false,
    }
  );


  User.associate = models => {
    User.hasOne(models.Cart)
    User.hasMany(models.Order);
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };


  return User;
};
