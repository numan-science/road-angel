import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { databaseProviders } from 'src/database/database.provider';
import { globalDbProvider } from './global-db.provider';
import { GlobalDbService } from './global-db.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [GlobalDbService, ...globalDbProvider, ...databaseProviders],
  exports: [GlobalDbService, ...databaseProviders],
})
export class GlobalDbModule {}
