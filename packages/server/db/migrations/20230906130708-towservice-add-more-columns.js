'use strict';

const TABLE = 'tow_service';
const COLUMN1 = 'address';
const COLUMN2 = 'phone';
const COLUMN3 = 'email';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, COLUMN1, {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(TABLE, COLUMN2, {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(TABLE, COLUMN3, {
      type: Sequelize.STRING,
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
    await queryInterface.removeColumn(TABLE, COLUMN2);
    await queryInterface.removeColumn(TABLE, COLUMN3);
   ;
  },
};
