const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('test', 'root', '123123', {
  host: 'localhost',
  password: process.env.MYSQL_PASSWORD,
  username: 'root',
  database: 'test',
  dialect: 'mysql',
});
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối đã thành công.');
  } catch (error) {
    console.error('Kết nối thất bại:', error);
  }
}
testConnection();
