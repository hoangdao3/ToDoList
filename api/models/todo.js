const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'done'),
      defaultValue: 'pending',
      allowNull: false
    }
  }, {});
  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    Todo.hasMany(models.TodoItem, {
      as: 'todoItems',
      foreignKey: 'todoId'
    });
  };
  return Todo;
};
