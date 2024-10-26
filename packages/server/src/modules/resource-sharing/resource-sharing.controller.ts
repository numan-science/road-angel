import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceSharingService } from './resource-sharing.service';
import { CreateResourceSharingDto } from './dto/create-resource-sharing.dto';
import { UpdateResourceSharingDto } from './dto/update-resource-sharing.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';

@Controller('resource-sharing')
export class ResourceSharingController {
  constructor(private readonly resourceSharingService: ResourceSharingService) {}

  @Post('createResource')
  create(@Body() body: CreateResourceSharingDto, @GetLoggedInUser() loggedInUser: any,
) {
    return this.resourceSharingService.create(body);
  }

  @Get()
  findAll() {
    return this.resourceSharingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceSharingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceSharingDto: UpdateResourceSharingDto) {
    return this.resourceSharingService.update(+id, updateResourceSharingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceSharingService.remove(+id);
  }
}
