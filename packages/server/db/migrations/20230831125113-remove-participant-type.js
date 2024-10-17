'use strict';

const TABLE = 'participant';
const COLUMN1 = 'fkUpdatedBy';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(TABLE, COLUMN1, {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(TABLE, COLUMN1);
   
  },
};
