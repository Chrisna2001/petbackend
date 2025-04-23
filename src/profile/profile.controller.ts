import {
    Controller,
    Get,
    Put,
    Body,
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
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import { JwtUserPayload } from '../auth/interfaces/user.interface';
  
  @ApiTags('profile')
  @Controller('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
      status: 200,
      description: 'Profile found',
      type: ProfileResponseDto,
    })
    async getProfile(@CurrentUser() user: JwtUserPayload) {
      return await this.profileService.findByUserId(user.sub);
    }
  
    @Put()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({
      status: 200,
      description: 'Profile updated',
      type: ProfileResponseDto,
    })
    async updateProfile(
      @CurrentUser() user: JwtUserPayload,
      @Body() profileDto: ProfileDto,
    ) {
      return await this.profileService.update(user.sub, profileDto);
    }
  
    @Post('upload-image')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload profile image for current user' })
    @ApiResponse({
      status: 200,
      description: 'Profile image uploaded',
      type: ProfileResponseDto,
    })
    @SingleFileUpload('profileImage')
    async uploadProfileImage(
      @CurrentUser() user: JwtUserPayload,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request,
    ) {
      return await this.profileService.updateProfileImage(user.sub, file, req);
    }
  }