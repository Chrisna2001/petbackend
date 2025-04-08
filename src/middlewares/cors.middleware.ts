// src/middleware/cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = ['http://localhost:3000', 'localhost:3000'];
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Production
    // const origin = req.headers.origin;

    // Swagger
    let rawHeaders = req.rawHeaders;
    let existInRawHeaders: string;

    for (let i = 0; i <= allowedOrigins.length - 1; i++) {
      existInRawHeaders = rawHeaders.find((item) => item === allowedOrigins[i]);
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
