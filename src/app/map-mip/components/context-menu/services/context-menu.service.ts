import { EventEmitter, Injectable } from '@angular/core';

export type ContextMenuEvent = { coordinates: [number, number], event: MouseEvent };

@Injectable()
export class ContextMenuService {
  openEmitter = new EventEmitter<ContextMenuEvent>();
}
