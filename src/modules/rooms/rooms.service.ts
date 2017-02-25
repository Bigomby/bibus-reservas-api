import { Component, NotFoundException } from '@nestjs/common';

import { ScraperService, Room } from '../scraper/scraper.service';
import { RoomStatusInfo } from '../scraper/interfaces/room-status-info.interface';
import { roomStatusInfo } from 'config/room-status-info';

@Component()
export class RoomsService {
  constructor(private readonly scraper: ScraperService) {}

  public async findRooms(library: string): Promise<Array<Room>> {
    if (!roomStatusInfo[library]) {
      throw new NotFoundException();
    }

    const rooms = await this.scraper.scrapeRooms(roomStatusInfo[library]);

    return rooms;
  }
}
