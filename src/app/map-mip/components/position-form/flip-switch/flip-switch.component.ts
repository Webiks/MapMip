import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapMipService} from "../../../api/map-mip.service";

@Component({
  selector: 'app-flip-switch',
  templateUrl: './flip-switch.component.html',
  styleUrls: ['./flip-switch.component.scss']
})
export class FlipSwitchComponent implements OnInit {
  private _state: boolean;

  @Output() public stateChange = new EventEmitter<boolean>();
  @Input()
  set state(value: boolean) {
    this._state = value;
    this.stateChange.emit(value);
  }
  get state() {
    return this._state
  }

  @Input() public tooltip: string;

  constructor(public mapmipService:MapMipService) { }

  ngOnInit() {
  }

}
