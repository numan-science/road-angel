module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('business_case', 'insuranceCaseId', {
              type: Sequelize.STRING,
              allowNull: true,
          }, {
          })
      ])
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('business_case', 'insuranceCaseId', {
              type: Sequelize.STRING,
              allowNull: true,
          }, {
          })
      ])
  }
};