import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './Roles-guard';

export function Auth(...roles: string[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
}
