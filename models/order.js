'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userid: DataTypes.INTEGER,
    companyid: DataTypes.INTEGER,
    description: DataTypes.STRING,
    instructions: DataTypes.STRING,
    notes: DataTypes.STRING,
    pod: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.Company, {
      foreignKey: 'companyid',
      as: 'company'
    })
    Order.belongsTo(models.User, {
      foreignKey: 'userid',
      as: 'user'
    })
  };
  return Order;
};