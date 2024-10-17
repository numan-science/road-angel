require('dotenv').config();
const knex = require('knex');
const fs = require('fs');
const _ = require('lodash');

const dbConfig = {};
dbConfig.client = process.env.DB_CLIENT;
if (process.env.DATABASE_URL) {
  dbConfig.connection = process.env.DATABASE_URL;
} else {
  dbConfig.connection = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    synchronize: false,
  };
}

console.log('dbConfig.connection', dbConfig.connection);
const dbConn = knex(dbConfig);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('');
      console.log('------------------- BASE TABLES');
      console.log('');
      const sql = fs
        .readFileSync(__dirname + '/../schemas/initial-db.sql')
        .toString();
      return dbConn.raw(sql);
    } catch (error) {
      console.log('error:: ', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await dbConn.raw(`
      SELECT * FROM pg_catalog.pg_tables 
      where tableowner = \'postgres\' and schemaname = \'public\';
    `);
    const SequelizeMetaTableName = 'SequelizeMeta';
    const tableDropPromises = _.map(tables.rows, (table) => {
      if (table.tablename === SequelizeMetaTableName) {
        return Promise.resolve(null);
      }
      return dbConn.schema.dropTableIfExists(table.tablename);
    });
    return Promise.all(tableDropPromises);
  },
};
