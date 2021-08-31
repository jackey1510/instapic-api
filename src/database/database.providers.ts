import { Post } from './../posts/entities/post.entity';
import { User } from './../users/entities/users.entity';

import { Like } from './../posts/entities/like.entity';
import { __prod__ } from '../constants';
import { createConnection, ConnectionOptions } from 'typeorm';
import 'dotenv-safe/config';

let connectionConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/../migrations/*.js'],
  // migrationsRun: true,
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
    // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    entities: [Like, Post, User],
    synchronize: true,
    // migrations: [__dirname + '/../migrations/*.js'],
    // migrationsRun: false,
  };
}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
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
