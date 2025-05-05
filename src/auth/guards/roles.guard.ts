import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLES_KEY } from './roles.decorator';
import { JwtUserPayload } from '../interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User authentication required');
    }
    
    const hasRole = requiredRoles.some(role => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Access denied: Role ${requiredRoles.join(', ')} required`);
    }
    
    return true;
  }
}