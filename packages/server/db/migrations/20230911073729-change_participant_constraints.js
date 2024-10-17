'use strict';
const Participant = 'participant';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(Participant, 'participant_fk2')
    .then(() =>
    queryInterface.addConstraint(Participant, {
      fields: ['liabilityInsuranceCompanyId'],
      type: 'foreign key',
      name: 'participant_fk2',
      references: {
        table: 'insurance_companies',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  )
  await queryInterface.removeConstraint(Participant, 'participant_fk4')
    .then(() =>
    queryInterface.addConstraint(Participant, {
      fields: ['damageInsuranceCompanyId'],
      type: 'foreign key',
      name: 'participant_fk4',
      references: {
        table: 'insurance_companies',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
