import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from '../profile/models/profile.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Profile])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}