import { Injectable, Logger } from '@nestjs/common';
import { GlobalDbService } from '../global-db/global-db.service';

@Injectable()
export class PermissionService {
  private logger = new Logger('PermissionService');
  constructor(private readonly DB: GlobalDbService) {}

  async getAllPermissions() {
    const permissions = this.DB.repo.Permission.findAndCountAll({
      order: [['id', 'asc']],
    });
    return permissions;
  }
}
