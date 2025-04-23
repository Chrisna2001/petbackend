// src/middleware/cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = ['http://localhost:3000', 'localhost:3000'];
    const apiUrl = this.configService.get<string>('API_URL');
    // const apiUrl = '7abd-103-99-218-90.ngrok-free.app';
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    console.log('reached ghere..............');

    // Production
    const origin = req.headers.host;

    console.log(origin, apiUrl);

    // Swagger
    let rawHeaders = req.rawHeaders;
    let existInRawHeaders: string;

    for (let i = 0; i <= allowedOrigins.length - 1; i++) {
      existInRawHeaders = rawHeaders.find((item) => item === allowedOrigins[i]);
    }

    // Check if origin matches API_URL from environment
    if (origin === apiUrl) {
      // Allow access if origin matches API_URL
      next();
      return;
    }

    // swagger
    if (!allowedOrigins.includes(existInRawHeaders)) {
      return res.status(403).json({ message: 'Forbidden Resource!' });
    }

    // Production
    // if (!allowedOrigins.includes(origin)) {
    //   return res.status(403).json({ message: 'Forbidden Resource!' });
    // }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  }
}