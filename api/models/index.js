/* eslint-disable max-len */
const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const TodoModel = require('./todo');
const TodoItemModel = require('./todoitem');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});
const User = UserModel(sequelize, Sequelize);
const Todo = TodoModel(sequelize, Sequelize);
const TodoItem = TodoItemModel(sequelize, Sequelize);
User.associate({ Todo });
Todo.associate({ User, TodoItem });
TodoItem.associate({ Todo });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Todo,
  TodoItem,
};
