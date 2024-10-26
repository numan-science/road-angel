import { Injectable } from '@nestjs/common';
import { CreateResourceSharingDto } from './dto/create-resource-sharing.dto';
import { UpdateResourceSharingDto } from './dto/update-resource-sharing.dto';
import { GlobalDbService } from '../global-db/global-db.service';

@Injectable()
export class ResourceSharingService {
  constructor(private readonly DB: GlobalDbService) {}

  create(body: any, loggedInUser: any) {
    console.log('body',body);
    console.log('loggedInUser',loggedInUser);
    
    const resource = this.DB.save('ResourceSharing', body, loggedInUser);
    return 'This action adds a new resourceSharing';
  }

  findAll() {
    return `This action returns all resourceSharing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceSharing`;
  }

  update(id: number, updateResourceSharingDto: UpdateResourceSharingDto) {
    return `This action updates a #${id} resourceSharing`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceSharing`;
  }
}
