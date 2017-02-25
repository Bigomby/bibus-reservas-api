import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('libraries/:library/rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  findAll(@Param() params) {
    if (!params.library) {
      throw new BadRequestException();
    }

    return this.rooms.findRooms(params.library);
  }
}
