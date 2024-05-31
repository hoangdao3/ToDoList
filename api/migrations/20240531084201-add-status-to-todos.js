// 'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Todos', 'status', {
      type: Sequelize.ENUM('pending', 'done'),
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Todos', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Todos_status";');
  }
};
