
module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },

    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  },

    { timestamps: false }
  );

  return OrderItem;
};
