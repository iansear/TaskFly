'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    emailpassword: DataTypes.STRING,
    emailservice: DataTypes.STRING,
    useemail: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    usephone: DataTypes.BOOLEAN
  }, {});
  Company.associate = function(models) {
    Company.belongsToMany(models.User, {
      through: 'User_Companies',
      as: 'users',
      foreignKey: 'companyid'
    })
    Company.hasMany(models.Order, {
      foreignKey: 'companyid',
      as: 'orders'
    })
  };
  return Company;
};