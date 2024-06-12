/* eslint-disable import/prefer-default-export */
const auth = require('../controllers/authController');
const validateAuth = require('../middlewares/validate');
const todos = require('../controllers/todosController');
const authorize = require('../middlewares/authorize');
const todoItems = require('../controllers/todoItemsController');
const db = require('../models');

module.exports = {
  routes: (app) => {
    app.get('/', (req, res) => res.send({ message: 'Welcome to Todo API' }));

    app.post('/api/auth/sign_up', validateAuth, auth.signUp);
    app.post('/api/auth/sign_in', auth.signIn);
    app.post('/api/auth/forgot_password', auth.sendResetLink);
    app.post('/api/reset_password', authorize, auth.resetPassword);

    app.post('/api/todos', authorize, todos.create);
    app.get('/api/todos', authorize, todos.fetchAll);
    app.get('/api/todos/:todoId', authorize, todos.fetchOne);
    app.put('/api/todos/:todoId', authorize, todos.update);
    app.delete('/api/todos/:todoId', authorize, todos.delete);
    // app.get('/api/todos/fill', authorize, todos.fillStatus);

    app.post('/api/todoItems', authorize, todoItems.create);
    app.get('/api/todoItems', authorize, todoItems.fetchAll);
    app.get('/api/todoItems/:todoItemId', authorize, todoItems.fetchOne);
    app.put('/api/todoItems/:todoItemId', authorize, todoItems.update);
    app.delete('/api/todoItems/:todoItemId', authorize, todoItems.delete);
    app.get('/users', async (req, res) => {
      try {
        const users = await db.User.findAll({
          include: [{
            model: db.Todo,
            as: 'todos',
            include: [{
              model: db.TodoItem,
              as: 'todoItems'
            }]
          }]
        });
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
};
