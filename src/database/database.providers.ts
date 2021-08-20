import { __prod__ } from '../constants';
import { createConnection, ConnectionOptions } from 'typeorm';
import 'dotenv-safe/config';

var connectionConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*.js'],
  migrationsRun: true,
};

if (__prod__) {
  connectionConfig = {
    type: 'postgres',
    host: process.env.DB_HOST as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    extra: {
      socketPath: process.env.DB_HOST!,
    },
    logging: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../migrations/*.js'],
    migrationsRun: true,
  };
}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      console.log(connectionConfig);
      try {
        const conn = await createConnection(connectionConfig);
        return conn;
      } catch (error) {
        console.error(error);
        return;
      }
    },
  },
];
