import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './models/profile.model';
import { User } from '../user/models/user.model';
import { ProfileDto } from './dto/profile.dto';
import { GlobalUploadService } from '../common/upload/global-upload.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile)
    private readonly profileModel: typeof Profile,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly globalUploadService: GlobalUploadService,
  ) {}

  async findByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }

    return profile;
  }

  /**
   * Update profile with provided details
   * This method allows updating all profile fields that are provided in the DTO
   */
  async update(userId: number, profileDto: ProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    
    // Update all fields provided in the DTO
    await profile.update({
      ...profileDto
    });
    
    return profile;
  }

  async updateProfileImage(userId: number, file: Express.Multer.File, req: any): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    
    const fileUrl = this.globalUploadService.processFile(file, req);
    
    await profile.update({
      profileImage: fileUrl,
    });
    
    return profile;
  }
}