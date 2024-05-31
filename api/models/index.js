const { Sequelize } = require('sequelize');
const UserModel = require('./User'); 
const TodoModel = require('./Todo'); 
const TodoItemModel = require('./TodoItem');

const sequelize = new Sequelize('test', 'root', '1231233', {
  host: 'localhost',
  // password: '1a23123',
  username: 'root',
  database: 'test',
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
