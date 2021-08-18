import { __prod__, envPath } from '../constants';
import { createConnection } from 'typeorm';
import { config } from 'dotenv-safe';

config({ path: envPath });

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
