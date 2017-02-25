import { Module } from '@nestjs/common';

import { RoomsModule } from 'modules/rooms/rooms.module';
import { ReservationsModule } from 'modules/reservations/reservations.module';
import { ScraperModule } from 'modules/scraper/scraper.module';

@Module({
  imports: [RoomsModule, ReservationsModule, ScraperModule],
})
export class AppModule {}
