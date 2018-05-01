import { Component, NotFoundException } from '@nestjs/common';

import { ScraperService, Room } from '../scraper/scraper.service';
import { Library } from 'modules/scraper/interfaces/library.interface';
import { Vector } from 'prelude.ts';

@Component()
export class RoomsService {
  constructor(private readonly scraper: ScraperService) {}

  public async findRooms(library: Library): Promise<Array<Room>> {
    const rooms = await this.scraper.scrapeRooms(library);

    return rooms;
  }

  public async findRoom(library: Library, roomName: string): Promise<Room> {
    const rooms = await this.scraper.scrapeRooms(library);
    const room = Vector.ofIterable(rooms)
      .filter(room => room.name === roomName)
      .fold(null, (v1, v2) => v1 || v2);

    return room;
  }
}
