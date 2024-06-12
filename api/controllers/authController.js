/* eslint-disable semi */
const validator = require('validator');
const sendEmail = require('../utils/sendEmail');
const models = require('../models');
const { hashPassword, jwtToken, comparePassword } = require('../utils');

const { User } = models;

require('dotenv').config();

const auth = {
  async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const hash = hashPassword(password);
      const user = await User.create({ name, email, password: hash });
      const token = jwtToken.createToken(user, process.env.JWT_SECRET);
      const { id } = user;
      return res.status(201).send({ token, user: { id, name, email } });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user && comparePassword(password, user.password)) {
        const { name, id } = user;
        const token = jwtToken.createToken(user, process.env.JWT_SECRET);
        return res.status(200).send({ token, user: { id, name, email } });
      }
      return res.status(400).send({ error: 'Invalid email/password combination' });
    } catch (e) {
      // Log the error for debugging purposes
      // eslint-disable-next-line no-console
      console.error('Error in signIn:', e);
      // Pass the error to the error handling middleware
      return next(new Error(e));
    }
  },
  async sendResetLink(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!email) {
        return res.status(400).send({ error: 'Email is required' });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).send({ error: 'Invalid email' });
      }
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      const token = jwtToken.createToken(user);
      const link = `${req.protocol}://localhost:5000/reset_password/${token}`;
      await sendEmail(
        email,
        'noreply@todo.com',
        'Best To Do password reset',
        `
        <div>Click the link below to reset your password</div><br/>
        <div>${link}</div>
        `
      );
      return res.status(200).send({ message: 'Password reset link has been successfully sent to your inbox' });
    } catch (e) {
      return next(new Error(e));
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword } = req.body;
      const { id } = req.user;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).send('New password and confirm password do not match!');
      }
      const hash = hashPassword(newPassword);
      await user.update({ password: hash });
      return res.status(200).send({ message: 'Password successfully updated' });
    } catch (e) {
      return next(new Error(e));
    }
  }
};
module.exports = auth;
