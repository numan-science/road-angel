module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('business_case', 'fkInsuranceCompanyId', {
        type: Sequelize.UUID,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('business_case', 'fkInsuranceCompanyId', {
        type: Sequelize.UUID,
        allowNull: true,
      }),
    ]);
  },
};
