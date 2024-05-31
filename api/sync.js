const db = require('./models');
require('dotenv').config();

console.log(process.env.JWT_SECRET)
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
}).catch(error => {
  console.error('Unable to create tables:', error);
});
