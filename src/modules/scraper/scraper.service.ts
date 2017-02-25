import { Component } from '@nestjs/common';
import { Vector, Option } from 'prelude.ts';
import * as cheerio from 'cheerio';
import axios from 'axios';

import { Status, Slot } from './interfaces/slot.interface';
import { RoomStatusInfo } from './interfaces/room-status-info.interface';

export type Room = { name?: string; capacity?: number; slots: Array<Slot> };
type FoldingRoom = { n: Option<string>; c: Option<number>; s: Option<Slot> };

const ROOM_NAME_CLASS = 'usrTituloSala well';

@Component()
export class ScraperService {
  public async scrapeRooms(info: RoomStatusInfo): Promise<Array<Room>> {
    const { data } = await axios.get(info.url);
    const $ = cheerio.load(data);

    const headers = $(info.selectors.headerSelector)
      .toArray()
      .filter(elment => elment.firstChild.childNodes.length > 1)
      .map(node => node.firstChild)
      .map(parseHeaders);

    const content = $(info.selectors.contentSelector)
      .toArray()
      .map(node => node.childNodes.map(parseContent));

    return Vector.ofIterable(headers)
      .zip(content)
      .flatMap(([headers, content]) =>
        Vector.ofIterable(content.map(room => addTimeFrame(room, headers))),
      )
      .toArray();
  }
}

function addTimeFrame(room: Room, headers: Array<string>): Room {
  return {
    name: room.name,
    capacity: room.capacity,
    slots: room.slots.map((slot, idx) => ({
      timeFrame: headers[idx],
      status: slot.status,
    })),
  };
}

function parseHeaders(node: CheerioElement): Array<string> {
  return Vector.ofIterable(node.childNodes)
    .filter(node => !!node.firstChild)
    .map(node => node.firstChild)
    .map(node => node.firstChild)
    .map(node => node.nodeValue)
    .toArray();
}

function parseContent(node: CheerioElement): Room {
  return Vector.ofIterable(node.childNodes)
    .map(parseRoom)
    .foldLeft<Room>({ slots: [] }, foldRooms);
}

function parseCapacity(node: CheerioElement): number {
  return parseInt(
    node.childNodes[2].firstChild.nodeValue.trim().match(/\d+/)[0],
  );
}

function parseRoom(node: CheerioElement): FoldingRoom {
  return node.attribs.class === 'usrTituloSala well'
    ? {
        n: Option.of(node.firstChild.nodeValue.trim()),
        c: Option.of(parseCapacity(node)),
        s: Option.none(),
      }
    : {
        n: Option.none(),
        c: Option.none(),
        s: Option.of({
          status: parseStatus(node),
        }),
      };
}

function parseStatus(node: CheerioElement): Status {
  switch (node.firstChild.nodeValue.trim()) {
    case 'Libre':
      return Status.Available;

    case 'Reservada':
      return Status.Reserved;

    case 'Cerrada':
      return Status.Closed;

    default:
      return Status.Unknown;
  }
}

function foldRooms(acc: Room, current: FoldingRoom): Room {
  if (current.n.isSome()) {
    acc.name = current.n.get();
  }

  if (current.s.isSome()) {
    acc.slots.push(current.s.get());
  }

  if (current.c.isSome()) {
    acc.capacity = current.c.get();
  }

  return acc;
}
