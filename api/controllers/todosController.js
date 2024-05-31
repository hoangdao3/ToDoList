const models = require('../models');

const { Todo, TodoItem } = models;

const todos = {
  async create({ body, decoded }, res, next) {
    try {
      const { title } = body;
      const { userId } = decoded;
      const todo = await Todo.create({ title, userId });
      return res.status(201).send(todo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async fetchAll({ decoded, query }, res, next) {
    try {
      const { skip, take, status } = query;
      const pageSkip = skip ? parseInt(skip, 10) : 0;
      const pageTake = take ? parseInt(take, 10) : 10;

      const whereCondition = { userId: decoded.userId };
      if (status) {
        whereCondition.status = status;
      }

      const myTodos = await Todo.findAll({
        where: whereCondition,
        include: [{
          model: TodoItem,
          as: 'todoItems'
        }],
        limit: pageTake,
        offset: pageSkip
      });
      return res.status(200).send(myTodos);
    } catch (e) {
      return next(new Error(e));
    }
  },
  async fetchOne({ params, decoded }, res, next) {
    try {
      const myTodo = await Todo.findOne({
        where: { id: params.todoId, userId: decoded.userId },
        include: [{
          model: TodoItem,
          as: 'todoItems'
        }],
      });
      if (!myTodo) {
        return res.status(404).send({ error: 'Todo not found' });
      }
      return res.status(200).send(myTodo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async update({ body, decoded, params }, res, next) {
    try {
      const todo = await Todo.findOne({ where: { id: params.todoId, userId: decoded.userId } });
      if (!todo) {
        return res.status(400).send({ error: 'Wrong todo id' });
      }

      const updatedTodo = await todo.update({
        title: body.title || todo.title,
        status: body.status || todo.status
      });

      return res.status(200).send(updatedTodo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async delete({ params, decoded }, res, next) {
    try {
      const todo = await Todo.findOne({ where: { id: params.todoId, userId: decoded.userId } });
      if (!todo) {
        return res.status(400).send({ error: 'Wrong todo id' });
      }
      await todo.destroy();
      return res.status(200).send({});
    } catch (e) {
      return next(new Error(e));
    }
  }
};

module.exports = todos;
