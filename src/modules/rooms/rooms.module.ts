import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { ScraperModule } from '../scraper/scraper.module';
import { RoomsService } from './rooms.service';

@Module({
  imports: [ScraperModule],
  components: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
