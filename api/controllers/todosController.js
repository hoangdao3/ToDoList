const { Op } = require('sequelize');
const models = require('../models');

const { Todo, TodoItem } = models;

const todos = {
  async create({ body, userFound }, res, next) {
    try {
      const { title } = body;
      const { id } = userFound;
      const todo = await Todo.create({ title, id });
      return res.status(201).send(todo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async fetchAll(req, res, next) {
    try {
      const { query } = req;
      const {
        skip, take, status, name, sortBy, sortOrder
      } = query;
      const { id } = req.user;
      console.log(req.user)
      const pageSkip = skip ? parseInt(skip, 10) : 0;
      const pageTake = take ? parseInt(take, 10) : 10;
      const whereCondition = { id };
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

  async fetchOne({ params, userFound }, res, next) {
    try {
      const myTodo = await Todo.findOne({
        where: { id: params.todoId, id: userFound.id },
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
      return next(new Error(e));
    }
  },

  async update({ body, userFound, params }, res, next) {
    try {
      const todo = await Todo.findOne({
        where: { id: params.todoId, id: userFound.id },
      });
      if (!todo) {
        return res.status(400).send({ error: 'Wrong todo id' });
      }

      const updatedTodo = await todo.update({
        title: body.title || todo.title,
        status: body.status || todo.status,
      });

      return res.status(200).send(updatedTodo);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async delete({ params, userFound }, res, next) {
    try {
      const todo = await Todo.findOne({
        where: { id: params.todoId, id: userFound.id },
      });
      if (!todo) {
        return res.status(400).send({ error: 'Wrong todo id' });
      }
      await todo.destroy();
      return res.status(200).send({});
    } catch (e) {
      return next(new Error(e));
    }
  },

  async fillStatus(req, res, next) {
    try {
      const { isCompleted } = req.query;
      if (typeof isCompleted === 'undefined') {
        return res
          .status(400)
          .send({ error: 'isCompleted query parameter is required' });
      }
      const whereCondition = { isCompleted: isCompleted === 'true' };
      const todoFound = await Todo.findAll({
        include: [
          {
            model: TodoItem,
            as: 'todoItems',
            where: whereCondition,
          },
        ],
      });

      return res.status(200).send(todoFound);
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = todos;
