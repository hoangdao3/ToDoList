const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Todo, {
      as: 'todos',
      foreignKey: 'userId',
    });
  };
  return User;
};
