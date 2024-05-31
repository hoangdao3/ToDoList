const { Sequelize } = require('sequelize');
const UserModel = require('./User');
const TodoModel = require('./Todo');
const TodoItemModel = require('./TodoItem');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: 'localhost',
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
