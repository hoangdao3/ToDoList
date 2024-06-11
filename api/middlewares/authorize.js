/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const models = require('../models');

const { User } = models;

config();

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const userFound = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' });
    const user = await User.findByPk(userFound.userId);
    if (!user) {
      return res.status(401).send({ error: 'User does not exist' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};
