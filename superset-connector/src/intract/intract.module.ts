// src/intract/intract.module.ts
import { Module } from '@nestjs/common';
import { IntractController } from './intract.controller';
import { IntractService } from './intract.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [IntractController],
  providers: [IntractService],
})
export class IntractModule {}
