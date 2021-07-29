import { __prod__ } from '../constants';
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      return await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: !__prod__,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [__dirname + '/migrations/*.js'],
        migrationsRun: true,
      }).catch((err) => console.log(err));
    },
  },
];
