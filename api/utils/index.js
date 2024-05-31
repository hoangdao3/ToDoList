/* eslint-disable import/prefer-default-export */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { config } = require('dotenv');

config();

const jwtToken = {
  createToken({ id, email }) {
    return jwt.sign(
      { userId: id, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  },
  verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' });
    return decoded;
  }
};

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
  jwtToken,
  hashPassword,
  comparePassword
};
