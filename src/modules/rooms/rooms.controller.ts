import {
  Controller,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { RoomsService } from './rooms.service';
import * as Config from 'config';
import { Library } from '../scraper/interfaces/library.interface';
import { FindParamsDto } from './dtos/find-params.dto';
import { FindAllParamsDto } from './dtos/find-all-params.dto';
import { Room } from '../scraper/scraper.service';

@Controller('libraries/:library/rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  public findAll(@Param() params: FindAllParamsDto): Promise<Array<Room>> {
    let info: Library;

    if (!params.library) {
      throw new BadRequestException();
    }

    try {
      info = Config.get(`Library.${params.library}`);
    } catch (e) {
      throw new NotFoundException('Unknown library');
    }

    return this.rooms.findRooms(info);
  }

  @Get('/:room')
  public find(@Param() params: FindParamsDto): Promise<Room> {
    let info: Library;

    if (!params.library) {
      throw new BadRequestException();
    }

    try {
      info = Config.get(`Library.${params.library}`);
    } catch (e) {
      throw new NotFoundException('Unknown library');
    }

    return this.rooms.findRoom(info, params.room);
  }
}
