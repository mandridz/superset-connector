// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntractModule } from './intract/intract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IntractModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
