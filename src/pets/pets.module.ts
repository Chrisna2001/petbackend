import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pet } from './models/pet.model';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { GlobalUploadModule } from '../common/upload/global-upload.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Pet]),
    GlobalUploadModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}