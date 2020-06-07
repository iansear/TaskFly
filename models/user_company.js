'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Company = sequelize.define('User_Company', {
    userid: DataTypes.INTEGER,
    companyid: DataTypes.INTEGER,
    isdelivery: DataTypes.BOOLEAN,
    isorders: DataTypes.BOOLEAN,
    isdispatcher: DataTypes.BOOLEAN
  }, {});
  User_Company.associate = function(models) {
    // associations can be defined here
  };
  return User_Company;
};