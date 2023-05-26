
module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    price: Sequelize.FLOAT
  },
    { timestamps: false }
  );

  return OrderItem;
};
