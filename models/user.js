'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    alias: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Company, {
      through: 'User_Companies',
      as: 'companies',
      foreignKey: 'userid'
    })
    User.hasMany(models.Order, {
      foreignKey: 'userid',
      as: 'orders'
    })
  };
  return User;
};