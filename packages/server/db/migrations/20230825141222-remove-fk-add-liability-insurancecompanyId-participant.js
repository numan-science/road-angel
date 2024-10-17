'use strict';

const TABLE = 'participant';
const COLUMN1 = 'fkinsurance_companyId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, COLUMN1, {
      type: Sequelize.UUID,
    });

    await queryInterface.addConstraint(TABLE, { // Use TABLE instead of participant
      fields: [COLUMN1],
      type: 'foreign key',
      name: 'participant_fk7',
      references: {
        table: 'insurance_companies',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, COLUMN1);
  },
};
