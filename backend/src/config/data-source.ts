import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Message } from '../chat/entities/message.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1700'),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || 'Abylay200427',
  database: process.env.DB_DATABASE || 'chat_db',
  entities: [User, Message],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  extra: {
    trustServerCertificate: true,
    validateConnection: false,
    connectionTimeout: 30000,
  },
}); 