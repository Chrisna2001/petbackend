// src/test/test.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './models/test.model';
import { TestService } from './test.service';
import { TestController } from './test.controller';

@Module({
  imports: [SequelizeModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}