/**
 * @file super-admin.guard.ts
 * @description Guard that restricts access to super admin users only.
 * Requires vaRole === 'super_admin' in JWT claims.
 */

import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { isSuperAdmin } from '../../features/auth/va-admin.service.js';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (!user?.authenticated) {
      throw new ForbiddenException('Authentication required.');
    }

    if (!isSuperAdmin(user.email)) {
      throw new ForbiddenException('Super admin access required.');
    }

    return true;
  }
}
