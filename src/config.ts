import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbSync: process.env.DB_SYNC,
  dbLog: process.env.DB_LOG,
  smsAPIKey: process.env.SMS_API_KEY,
  smsEndpoint: process.env.SMS_ENDPOINT,
  smsSender: process.env.SMS_SENDER,
  secretKey:
    process.env.SECRET_KEY !== undefined
      ? process.env.SECRET_KEY
      : 'wDEZVncdNhPhxho',
};
