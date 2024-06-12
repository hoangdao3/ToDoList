const { Op } = require('sequelize');
const models = require('../models');

const { Todo, TodoItem } = models;

const todos = {
  async create(req, res, next) {
    try {
      const { title } = req.body;
      const { id: userId } = req.user;
      const todo = await Todo.create({ title, userId });
      return res.status(201).send(todo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async fetchAll(req, res, next) {
    try {
      const { query } = req;
      console.log('1')
      const {
        skip, take, status, name, sortBy, sortOrder
      } = query;
      const { id: userId } = req.user;
      const pageSkip = skip ? parseInt(skip, 10) : 0;
      const pageTake = take ? parseInt(take, 10) : 10;
      const whereCondition = { userId };
      if (status) {
        whereCondition.status = status;
      }
      if (name) {
        whereCondition.title = { [Op.like]: `%${name}%` };
      }
      const order = [];
      if (sortBy) {
        const validSortByFields = ['createdAt', 'updatedAt'];
        const validSortOrder = ['ASC', 'DESC'];

        if (validSortByFields.includes(sortBy)) {
          order.push([sortBy, validSortOrder.includes(sortOrder) ? sortOrder : 'ASC']);
        }
      }
      const myTodos = await Todo.findAll({
        where: whereCondition,
        include: [
          {
            model: TodoItem,
            as: 'todoItems',
          },
        ],
        limit: pageTake,
        offset: pageSkip
      });

      return res.status(200).send(myTodos);
    } catch (e) {
      return next(new Error(e));
    }
  },
  async fetchOne({ params }, res, next) {
    try {
      const myTodo = await Todo.findOne({
        where: { id: params.todoId },
        include: [
          {
            model: TodoItem,
            as: 'todoItems',
          },
        ],
      });
      if (!myTodo) {
        return res.status(404).send({ error: 'Todo not found' });
      }
      return res.status(200).send(myTodo);
    } catch (e) {
      console.error('Error:', e);
      return next(new Error(e));
    }
  },

  async update(req, res, next) {
    try {
      const { todoId } = req.params;
      const { id: userId } = req.user;
      const { title, status } = req.body;
      const todo = await Todo.findOne({
        where: { id: todoId, userId },
      });

      if (!todo) {
        return res.status(404).send({ error: 'Todo not found' });
      }
      const updatedTodo = await todo.update({
        title: title || todo.title,
        status: status || todo.status,
      });
      return res.status(200).send(updatedTodo);
    } catch (e) {
      return next(new Error(e.message));
    }
  },

  async delete(req, res, next) {
    try {
      const { todoId } = req.params;
      const { id: userId } = req.user;
      const todo = await Todo.findOne({
        where: { id: todoId, userId },
      });
      if (!todo) {
        return res.status(404).send({ error: 'Todo not found' });
      }
      await todo.destroy();
      return res.status(200).send({ message: 'Todo deleted successfully' });
    } catch (e) {
      return next(new Error(e.message));
    }
  },

};

module.exports = todos;
