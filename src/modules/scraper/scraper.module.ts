import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Module({
  components: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
