import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { DATABASE_META, pagination as constants } from '../constants';

export const getRawParams = (dataParams: any, model: any) => {
  const attributes = Object.keys(model.rawAttributes);
  const where = {};
  if (!_.isEmpty(dataParams)) {
    _.each(_.keys(dataParams), (key) => {
      if (attributes.includes(key)) {
        where[key] = dataParams[key];
      }
    });
  }
  return where;
};

export const getPaginationOptions = (params: any = {}) => {
  if (params?.limit === constants.ALL || !params.limit) {
    return {};
  }
  const pagination = { limit: constants.DEFAULT_LIMIT, offset: 0 };
  if (params.limit && !isNaN(params.limit)) {
    pagination.limit = parseInt(params.limit, 10);
  }
  if (params.page && !isNaN(params.page)) {
    pagination.offset = (parseInt(params.page, 10) - 1) * pagination.limit;
  }
  return pagination;
};

export const generateSearchQuery = (dataParams: any, attributes: any) => {
  const where = {};
  _.each(_.keys(dataParams), (key) => {
    if (attributes[key]) {
      where[key] = { $iLike: `%${dataParams[key]}%` };
    }
  });
  return where;
};

export const createSequelizeInstance = () => {
  return new Sequelize(
    DATABASE_META.database,
    DATABASE_META.username,
    DATABASE_META.password,
    {
      host: DATABASE_META.host,
      dialect: 'postgres',
    },
  );
};
