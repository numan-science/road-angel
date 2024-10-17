'use strict';
const TABLE_1 = 'workshop';
const TABLE_2 = 'tow_service';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE_1, 'rating', {
      type: Sequelize.FLOAT,
      defaultValue: 5,
    });
    await queryInterface.addColumn(TABLE_2, 'rating', {
      type: Sequelize.FLOAT,
      defaultValue: 5, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE_1, 'rating');
    await queryInterface.removeColumn(TABLE_2, 'rating');
  },
};
