require('dotenv').config();

const KB = 1024;
const MB = 1024 * KB;

// File Upload
export const MAX_PHOTO_SIZE = 5 * MB;
export const MAX_FILE_SIZE = 25 * MB;

export const FACEBOOK_API_PRIFIX = 'https://graph.facebook.com/v15.0';
export const OPENAI_API_KEY =
  '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';

export const PORT = process.env?.PORT;
export const BASE_URL = process.env?.BASE_URL;
export const CLIENT_URL = process.env?.CLIENT_URL;
export const SALT_ROUNDS = process.env?.SALT_ROUNDS;
export const APP_ID = process.env?.APP_ID;

export const DEFAULT_PASSPORT_STRATEGY = 'jwt';
export const JWT_SECRET_KEY = process.env?.JWT_SECRET_KEY;
export const JWT_TOKEN_EXPIRY_DEFAULT = 3600 * 8; //default 8 hours expiry value in seconds
export const JWT_TOKEN_EXPIRY_REMEMBER_ME = 3600 * 730; //default 1 month expiry value in seconds

export const TOKEN_EXPIRY_DEFAULT = 8; //default 8 hours expiry
export const TOKEN_EXPIRY_REMEMBER_ME = 1; //default 1 month expiry

export const UNIQUE_KEY_VIOLATION = '23505'; // Postgres error code for unique key violation

export const FORGOT_PASSWORD_TOKEN_EXPIRY_HOURS = 2; // Forgot password token expiry 2 hours

// Pagination
export const pagination = {
  ALL: 'all',
  DEFAULT_LIMIT: 20,
};

// Roles
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  COMPANY_ADMIN: 'Company Admin',
  SALE_MANAGER: 'Sale Manager',
  BUSINESS_MANAGER: 'Business Manager',
};


// Social Media Types
export const SOCIAL_MEDIA_TYPES = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TWITTER: 'Twitter',
  LINKEDIN: 'LinkedIn',
  PINTEREST: 'Pinterest',
  GOOGLEPLUS: 'Google+',
};

// Post Types
export const POST_TYPES = {
  NOW: 'Now',
  SCHEDULED: 'Scheduled',
};

export const DATE_FORMAT = 'DD-MMM-YYYY';
export const DATE_MONTH_FORMAT = 'MMM-YYYY';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const INPUT_DATE_TIME_FORMAT = 'ddd MMM D YYYY HH:mm:ss Z';

export const ALL = 'all';
export const ANY = 'any';

export const S3 = {
  ACCESS_KEY_ID: 'AKIAQYRTAEATIJ4BI73I',
  SECRET_ACCESS_KEY: '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',
  REGION: 'eu-central-1',
  BUCKET_NAME: 'roadangel',
};
export const S3_URL = 'https://roadangel.s3.eu-central-1.amazonaws.com';

export const UPLOAD_TYPES = {
  PICTURE: 'Picture',
  VIDEO: 'Video',
};

export const DATABASE_META = {
  username: process.env?.DB_USERNAME,
  password: process.env?.DB_PASSWORD,
  database: process.env?.DB_DATABASE,
  host: process.env?.DB_HOST,
  port: process.env?.DB_PORT,
  client: process.env?.DB_CLIENT,
};
