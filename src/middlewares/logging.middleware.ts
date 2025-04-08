// src/logs/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from 'src/logs/models/logs.model';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Log)
    private logModel: typeof Log,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip, body } = req;

    res.on('finish', async () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      // Skip logging for health checks or static files
      // if (originalUrl.includes('health')) return;

      await this.logModel.create({
        method,
        endpoint: originalUrl,
        status_code: statusCode,
        response_time: duration,
        ip_address: ip,
        user_agent: req.get('user-agent'),
        error_message: statusCode >= 400 ? res.statusMessage : null,
      });
    });

    next();
  }
}
