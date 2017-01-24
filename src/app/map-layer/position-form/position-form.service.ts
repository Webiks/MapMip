import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class PositionFormService {
  public onPicked:boolean;
  public markerPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

}
