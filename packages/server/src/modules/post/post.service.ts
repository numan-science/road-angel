import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { GlobalDbService } from '../global-db/global-db.service';

@Injectable()
export class PostService {
  private logger = new Logger('PostService');
  constructor(
    private readonly DB: GlobalDbService,
  ) {}
}
