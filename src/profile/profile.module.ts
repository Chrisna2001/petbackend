import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './models/profile.model';
import { User } from '../user/models/user.model';
// import { ProfileService } from './profile.service';
// import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { GlobalUploadModule } from '../common/upload/global-upload.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Profile, User]),
    GlobalUploadModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}