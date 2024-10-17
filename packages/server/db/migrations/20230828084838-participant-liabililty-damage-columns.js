'use strict';

const TABLE = 'participant';
const COLUMN1 = 'fkLiabilityInsuranceCompanyId';
const COLUMN2 = 'fkDamageInsuranceCompanyId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(TABLE, COLUMN1, 'liabilityInsuranceCompanyId');
    await queryInterface.renameColumn(TABLE, COLUMN2,'damageInsuranceCompanyId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(TABLE, 'liabilityInsuranceCompanyId',COLUMN1);
    await queryInterface.renameColumn(TABLE, 'damageInsuranceCompanyId',COLUMN2);
  },
};
