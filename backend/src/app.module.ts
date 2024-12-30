import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 1700,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || 'Abylay200427',
      database: process.env.DB_DATABASE || 'chat_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      options: {
        encrypt: false,
      },
    }),
    AuthModule,
    ChatModule,
    UsersModule,
  ],
})
export class AppModule {} 