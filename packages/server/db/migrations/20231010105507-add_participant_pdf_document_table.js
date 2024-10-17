
'use strict';
const ACCIDENT_CASE_DOCUMENTS = 'accident_case_documents';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(ACCIDENT_CASE_DOCUMENTS, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false,
        },
        fkAccidentCaseId: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        fkCulpritParticipantId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
      
        fkDamageParticipantId: {
          type: Sequelize.UUID,
          allowNull: true,
        },
      
      
        fkCreatedBy: { type: Sequelize.UUID, allowNull: true },
        fkUpdatedBy: { type: Sequelize.UUID, allowNull:true },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
        deletedAt: { type: Sequelize.DATE },
      })
      // .then(() =>
      //   queryInterface.addConstraint(ACCIDENT_CASE_DOCUMENTS, {
      //     fields: ['fkAccidentCaseId'],
      //     type: 'foreign key',
      //     name: 'accident_case_documents_fk0',
      //     references: {
      //       table: 'accident_case_documents',
      //       field: 'id',
      //     },
      //     onDelete: 'cascade',
      //     onUpdate: 'cascade',
      //   }),
      // )

  
      .then(() =>
        queryInterface.addConstraint(ACCIDENT_CASE_DOCUMENTS, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'accident_case_documents_fk1',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(ACCIDENT_CASE_DOCUMENTS, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'accident_case_documents_fk2',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      );
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(ACCIDENT_CASE_DOCUMENTS);
  },
};

