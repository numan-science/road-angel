require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    client: process.env.DB_CLIENT,
    synchronize: false,
  },
};