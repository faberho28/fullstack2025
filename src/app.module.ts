import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthController } from './presentation/controllers/health.controller';
import { LoansController } from './presentation/controllers/loans.controller';
import { BooksController } from './presentation/controllers/books.controller';
import { ApplicationModule } from './application/application.module';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ApplicationModule,
  ],
  controllers: [HealthController, LoansController, BooksController, UsersController],
})
export class AppModule {}
