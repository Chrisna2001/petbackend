// src/common/upload/file-upload.decorators.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

/**
 * Custom decorator for single file uploads with swagger documentation
 */
export function SingleFileUpload(fieldName: string, required = false) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: `${fieldName} file upload`,
          },
        },
      },
    }),
  );
}

/**
 * Custom decorator for multiple files upload with swagger documentation
 */
export function MultipleFilesUpload(fieldName: string, maxCount = 10, required = false) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: `${fieldName} files upload (max ${maxCount})`,
          },
        },
      },
    }),
  );
}










//-----------------------------------------usage--------------------------


// Step 5: Example usage in any controller
// src/user/user.controller.ts (example)
// import { Controller, Post, Get, Body, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { Request } from 'express';
// import { GlobalUploadService } from '../common/upload/global-upload.service';
// import { SingleFileUpload, MultipleFilesUpload } from '../common/upload/file-upload.decorators';

// @ApiTags('users')
// @Controller('users')
// export class UserController {
//   constructor(
//     private readonly userService: UserService,
//     private readonly globalUploadService: GlobalUploadService
//   ) {}

//   @Post('profile-picture')
//   @ApiOperation({ summary: 'Update user profile picture' })
//   @SingleFileUpload('profilePic')
//   async uploadProfilePicture(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: { userId: string },
//     @Req() req: Request
//   ) {
//     const fileUrl = this.globalUploadService.processFile(file, req);
//     // Now you can save fileUrl to user profile in database
//     return {
//       success: true,
//       fileUrl,
//       userId: body.userId
//     };
//   }

//   @Post('gallery')
//   @ApiOperation({ summary: 'Upload multiple gallery images' })
//   @MultipleFilesUpload('gallery', 5)
//   async uploadGalleryImages(
//     @UploadedFiles() files: Array<Express.Multer.File>,
//     @Body() body: { userId: string },
//     @Req() req: Request
//   ) {
//     const fileUrls = this.globalUploadService.processFiles(files, req);
//     // Now you can save fileUrls to user gallery in database
//     return {
//       success: true,
//       fileUrls,
//       userId: body.userId
//     };
//   }
// }