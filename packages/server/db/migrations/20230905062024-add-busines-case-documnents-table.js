'use strict';
const BUSINESS_CASE_DOCUMENTS = 'business_case_documents';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(BUSINESS_CASE_DOCUMENTS, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false,
        },
        fkBusinessCaseId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
       

        fileName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
          
        status: {
          type: Sequelize.STRING,
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
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_DOCUMENTS, {
          fields: ['fkBusinessCaseId'],
          type: 'foreign key',
          name: 'business_case_documents_fk0',
          references: {
            table: 'business_case',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )

  
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_DOCUMENTS, {
          fields: ['fkCreatedBy'],
          type: 'foreign key',
          name: 'business_case_documents_fk1',
          references: {
            table: 'users',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        }),
      )
      .then(() =>
        queryInterface.addConstraint(BUSINESS_CASE_DOCUMENTS, {
          fields: ['fkUpdatedBy'],
          type: 'foreign key',
          name: 'business_case_documents_fk2',
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
    await queryInterface.dropTable(BUSINESS_CASE_DOCUMENTS);
  },
};
