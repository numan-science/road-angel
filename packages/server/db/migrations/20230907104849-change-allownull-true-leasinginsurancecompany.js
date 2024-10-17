module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('leasing_insurance_company', 'rating', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('leasing_insurance_company', 'rating', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
    ]);
  },
};

