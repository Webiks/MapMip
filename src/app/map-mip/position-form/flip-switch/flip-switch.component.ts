import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-flip-switch',
  templateUrl: './flip-switch.component.html',
  styleUrls: ['./flip-switch.component.scss']
})
export class FlipSwitchComponent implements OnInit {
  // private _state: boolean;

  @Input() state: boolean;
  @Output() public stateChange = new EventEmitter<boolean>();
  @Input() public tooltip: string;

  changes(checked: boolean) {
    this.stateChange.emit(checked);
  }

  // set state(value: boolean) {
  //   this._state = value;
  //   this.stateChange.emit(value);
  // }
  // get state() {
  //   return this._state
  // }


  ngOnInit() {
  }

}
