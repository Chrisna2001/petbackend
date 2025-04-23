import {
    Controller,
    Get,
    Put,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Req,
    UploadedFile,
    Post,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { ProfileService } from './profile.service';
  import { ProfileDto } from './dto/profile.dto';
  import { ProfileResponseDto } from './dto/profile-response.dto';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { SingleFileUpload } from '../common/upload/file-upload.decorators';
  import { Request } from 'express';
  
  @ApiTags('profile')
  @Controller('profile')
  @ApiBearerAuth('access-token')
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    @Get(':userId')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get user profile by user ID' })
    @ApiResponse({
      status: 200,
      description: 'Profile found',
      type: ProfileResponseDto,
    })
    async getProfile(@Param('userId', ParseIntPipe) userId: number) {
      return await this.profileService.findByUserId(userId);
    }
  
    @Put(':userId')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({
      status: 200,
      description: 'Profile updated',
      type: ProfileResponseDto,
    })
    async updateProfile(
      @Param('userId', ParseIntPipe) userId: number,
      @Body() profileDto: ProfileDto,
    ) {
      return await this.profileService.update(userId, profileDto);
    }
  
    @Post(':userId/upload-image')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload profile image' })
    @ApiResponse({
      status: 200,
      description: 'Profile image uploaded',
      type: ProfileResponseDto,
    })
    @SingleFileUpload('profileImage')
    async uploadProfileImage(
      @Param('userId', ParseIntPipe) userId: number,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
    ) {
      return await this.profileService.updateProfileImage(userId, file, req);
    }
  }