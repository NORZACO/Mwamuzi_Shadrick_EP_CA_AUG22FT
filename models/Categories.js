module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: Sequelize.STRING
    }


  }, { timestamps: false });

  Category.associate = models => {
    Category.hasMany(models.Item);
  };

  return Category;
};
