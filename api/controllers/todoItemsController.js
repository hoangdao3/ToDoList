/* eslint-disable object-curly-newline */
const models = require('../models');

const { TodoItem, Todo } = models;

const todoItems = {
  async create(req, res, next) {
    try {
      const { text, todoId } = req.body;
      // Validation
      if (!text) { return res.status(400).send({ error: 'Text is required' }); }
      if (!todoId) { return res.status(400).send({ error: 'todoId is required' }); }
      const item = await TodoItem.create({ text, todoId });
      return res.status(201).send(item);
    } catch (e) {
      return next(new Error(e));
    }
  },

  async fetchAll(req, res, next) {
    try {
      const { query } = req;
      const { take, skip, todoId } = query;
      const { id: userId } = req.user;
      if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
      }
      const limit = parseInt(take, 10) || 10;
      const offset = parseInt(skip, 10) || 0;
      const items = await TodoItem.findAll({
        where: { todoId },
        include: [{
          model: Todo,
          as: 'todo'
        }],
        limit,
        offset
      });

      return res.status(200).send(items);
    } catch (e) {
      return next(new Error(e.message));
    }
  },
  async fetchOne({ params }, res, next) {
    try {

      const myTodo = await TodoItem.findOne({
        where: { id: params.todoItemId },
        include: [
          {
            model: Todo,
            as: 'todo'
          },
        ],
      });
      if (!myTodo) {
        return res.status(404).send({ error: 'TodoItem not found' });
      }
      return res.status(200).send(myTodo);
    } catch (e) {
      console.error('Error:', e);
      return next(new Error(e));
    }
  },

  async update({ body, params }, res, next) {
    try {
      const { text, isCompleted } = body;
      if (!params.todoItemId) {
        return res.status(400).send({ error: 'todoItemId is required' });
      }
      const item = await TodoItem.findOne({
        where: { id: params.todoItemId },
      });
      if (!item) {
        return res.status(404).send({ error: 'Item does not exist' });
      }
      const updatedItem = await TodoItem.update(
        { text: text || item.text, isCompleted },
        {
          where: { id: params.todoItemId },
          returning: true,
          plain: true,
        }
      );
      console.log(updatedItem)
      return res.status(200).send({message: 'update complete'});
    } catch (e) {
      return next(new Error(e));
    }
  },

  async delete({ params }, res, next) {
    try {
      if (!params.todoItemId) { return res.status(400).send({ error: 'todoItemId is required' }); }
      const item = await TodoItem.findOne({
        where: { id: params.todoItemId },
      });
      if (!item) {
        return res.status(404).send({ error: 'Item does not exist' });
      }
      await item.destroy();
      return res.status(200).send({});
    } catch (e) {
      return next(new Error(e));
    }
  }
};

module.exports = todoItems;
