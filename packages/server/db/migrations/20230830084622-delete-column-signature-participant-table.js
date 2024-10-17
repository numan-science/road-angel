'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('participant', 'signature');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('participant', 'signature', {
      type: Sequelize.DataTypes.STRING, 
      allowNull: true, 
    });
  }
};
