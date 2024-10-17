require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';
import { appModels } from '../models/index.models';

const sequelizeOptions: any = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  client: process.env.DB_CLIENT,
  synchronize: false,
  logging: false,
};

export const databaseProviders = [
  {
    
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let sequelize: any = {};
      if (process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);
      } else {
        sequelize = new Sequelize(
          process.env.DB_DATABASE,
          process.env.DB_USERNAME,
          process.env.DB_PASSWORD,
          sequelizeOptions,
        );
      }
      sequelize.addModels(appModels);
      await sequelize.sync();
      return sequelize;
    },
    useExisting: Sequelize,
  },
];