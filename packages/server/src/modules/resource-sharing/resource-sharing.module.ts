import { Module } from '@nestjs/common';
import { ResourceSharingService } from './resource-sharing.service';
import { ResourceSharingController } from './resource-sharing.controller';

@Module({
  controllers: [ResourceSharingController],
  providers: [ResourceSharingService]
})
export class ResourceSharingModule {}
