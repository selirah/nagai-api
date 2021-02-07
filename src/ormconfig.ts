import { ConnectionOptions } from 'typeorm';
import path from 'path';
import { config } from './config';

export const ormconfig: ConnectionOptions = {
  type: 'postgres',
  port: config.dbPort === '5432' ? parseInt(config.dbPort) : 5432,
  database: config.dbName,
  username: config.dbUser,
  password: config.dbPass,
  logging: config.dbLog === 'true' ? true : false,
  synchronize: config.dbSync === 'true' ? true : false,
  migrations: [path.join(__dirname, './migrations/*')],
  entities: [path.join(__dirname, './entities/*')],
  cli: {
    entitiesDir: path.join(__dirname, './entities'),
    migrationsDir: path.join(__dirname, './migrations'),
  },
};
