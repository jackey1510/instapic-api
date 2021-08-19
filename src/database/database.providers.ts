import { __prod__ } from '../constants';
import { createConnection, ConnectionOptions } from 'typeorm';

const connectionConfig: ConnectionOptions = {
  type: 'postgres',
  url: __prod__ ? undefined : process.env.DATABASE_URL,
  host: __prod__ ? process.env.DB_HOST : undefined,
  username: __prod__ ? process.env.DB_USER : undefined,
  password: __prod__ ? process.env.DB_PASS : undefined,
  extra: __prod__
    ? {
        socketPath: process.env.DB_HOST,
      }
    : undefined,
  logging: !__prod__,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.js'],
  migrationsRun: true,
};

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      return await createConnection(connectionConfig).catch((err) =>
        console.log(err),
      );
    },
  },
];
