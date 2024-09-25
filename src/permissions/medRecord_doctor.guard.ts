import { MedRecordsService } from '../med-records/med-records.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PermittedGuard implements CanActivate {
  constructor(private readonly MedRecordsService: MedRecordsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.id === request.params.id) {
      return true;
    }
    if (user.role === 'doctor') {
      const permission = await this.MedRecordsService.checkRecordPermission(
        request.params.recordId,
        user.id,
      );
      return !!permission;
    }
    return false;
  }
}
