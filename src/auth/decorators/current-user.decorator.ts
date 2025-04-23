// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserPayload } from '../interfaces/user.interface';

/**
 * Custom decorator to extract the current user from the request.
 * Works for both users and service providers.
 * 
 * Usage: 
 * - @CurrentUser() user: JwtUserPayload
 * - @CurrentUser('sub') userId: string
 * - @CurrentUser('user_type') userType: UserType
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): JwtUserPayload | any => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      return null;
    }
    
    // Return specific property if provided, otherwise return the entire user object
    if (data) {
      return request.user[data];
    }
    
    return request.user;
  },
);

/**
 * Custom decorator to check if the current user is a regular user (not a service provider)
 * Returns true if the user_type is 'user'
 */
export const IsUser = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    return request.isUser === true;
  },
);

/**
 * Custom decorator to check if the current user is a service provider
 * Returns true if the user_type is 'service_provider'
 */
export const IsServiceProvider = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    return request.isServiceProvider === true;
  },
);