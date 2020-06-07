'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  Company.associate = function(models) {
    Company.belongsToMany(models.User, {
      through: 'User_Companies',
      as: 'users',
      foreignKey: 'companyid'
    })
  };
  return Company;
};