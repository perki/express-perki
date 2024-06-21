'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;

    const User = sequelize.define('User', {
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'users'
    });

    await User.sync({ force: true });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
