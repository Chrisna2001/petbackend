import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetListing } from './models/pet-listing.model';
// import { PetListingsService } from './pet-listings.service';
// import { PetListingsController } from './pet-listings.controller';
import { PetListingsService } from './pet-listing.service';
import { PetListingsController } from './pet-listing.controller';
import { GlobalUploadModule } from '../common/upload/global-upload.module';
import { User } from '../user/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([PetListing, User]),
    GlobalUploadModule,
  ],
  controllers: [PetListingsController],
  providers: [PetListingsService],
  exports: [PetListingsService],
})
export class PetListingsModule {}