// Step 1: Create a global upload module
// src/common/upload/global-upload.module.ts
import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { GlobalUploadService } from './global-upload.service';
import { GlobalUploadService } from './global-upload.service';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        fileFilter: (req, file, callback) => {
          // You can customize file filtering per file type
          const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
          if (file.fieldname === 'image' && !acceptedImageTypes.includes(file.mimetype)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB max size
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GlobalUploadService],
  exports: [GlobalUploadService, MulterModule],
})
export class GlobalUploadModule {}