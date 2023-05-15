//models/OrderItems.js

//TODO: Create OrderItems model
// module.exports = (sequelize, Sequelize) => {
//     const OrderItem = sequelize.define(
//         'OrderItem',
//         {
//             id: {
//                 type: Sequelize.DataTypes.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true,
//             },
//             order_id: {
//                 type: Sequelize.DataTypes.INTEGER,
//                 allowNull: false,
//             },
//             item_id: {
//                 type: Sequelize.DataTypes.INTEGER,
//                 allowNull: false,
//             },
//             quantity: {
//                 type: Sequelize.DataTypes.INTEGER,
//                 allowNull: false,
//             },
//             price_at_time_of_order: {
//                 type: Sequelize.DataTypes.FLOAT,
//                 allowNull: false,
//             },
//             created_at: {
//                 type: Sequelize.DataTypes.DATE,
//                 allowNull: false,
//                 defaultValue: Sequelize.NOW,
//             },
//             updated_at: {
//                 type: Sequelize.DataTypes.DATE,
//                 allowNull: false,
//                 defaultValue: Sequelize.NOW,
//             },
//         },
//         {
//             timestamps: false,
//         }
//     );

//     OrderItem.associate = function (models) {
//         OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
//         OrderItem.belongsTo(models.Item, { foreignKey: 'item_id', as: 'item' });
//     };

//     return OrderItem;
// };

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
