// src/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppErrors } from './errors/errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default error response
    let errorResponse = {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url
    };

    // Handle NestJS built-in HTTP exceptions
    if (exception.getStatus && exception.getResponse) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      
      errorResponse = {
        statusCode: status,
        message: typeof res === 'string' ? res : res.message,
        error: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url
      };
    } 
    // Handle our custom error objects
    else if (exception.statusCode && exception.error) {
      errorResponse = {
        statusCode: exception.statusCode,
        message: exception.message,
        error: exception.error,
        timestamp: new Date().toISOString(),
        path: request.url
      };
    }

    // Send the formatted error response
    response.status(errorResponse.statusCode).json(errorResponse);
  }
}