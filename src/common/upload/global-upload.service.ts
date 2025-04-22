// Step 2: Create a global upload service
// src/common/upload/global-upload.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class GlobalUploadService {
  constructor() {
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  /**
   * Process uploaded file and return URL
   */
  processFile(file: Express.Multer.File, req: Request): string {
    if (!file) return null;
    
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${file.filename}`;
  }

  /**
   * Process uploaded files and return URLs
   */
  processFiles(files: Express.Multer.File[], req: Request): string[] {
    if (!files || files.length === 0) return [];
    
    const protocol = req.protocol;
    const host = req.get('host');
    
    return files.map(file => `${protocol}://${host}/uploads/${file.filename}`);
  }

  /**
   * Create multer options for specific use cases
   */
  getMulterOptions(fieldName: string, fileTypes: string[], maxFileSize = 5) {
    return {
      fileFilter: (req, file, callback) => {
        if (file.fieldname === fieldName && !fileTypes.includes(file.mimetype)) {
          return callback(
            new Error(`Only ${fileTypes.join(', ')} files are allowed!`), 
            false
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
      },
    };
  }
}