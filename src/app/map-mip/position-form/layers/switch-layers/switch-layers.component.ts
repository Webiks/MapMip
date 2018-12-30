import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-switch-layers',
  templateUrl: './switch-layers.component.html',
  styleUrls: ['./switch-layers.component.scss'],
  animations: [
    trigger('fadeInOut',
      [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('0.25s', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('0.25s', style({ opacity: 0 }))
        ])
      ])
  ]
})

export class SwitchLayersComponent {
  private _active = true;
  alert = false;
  timeoutEvent;

  @Input() public layersArray;
  @Output() public layersArrayChange = new EventEmitter();
  @Output() submitLayersEmitter = new EventEmitter();

  @HostListener('window:keypress', ['$event'])
  keypress($event) {
    if ($event.which === 32 && this.active) {
      this.switch();
      this.submitLayersEmitter.emit();
    }
  }

  toggleSwitchBtn(btn: HTMLElement) {
    btn.blur();
    this.active = !this.active;
  }

  switch() {
    let newLayersArray = this.layersArray.map((val, index: number, array) => {
      const prev = (index - 1) < 0 ? array.length + (index - 1) : (index - 1);
      return array[prev];
    });
    this.layersArrayChange.emit(newLayersArray);
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    clearTimeout(this.timeoutEvent);

    if (value) {
      this.alert = true;
      this.timeoutEvent = setTimeout(() => {
        this.alert = false;
      }, 2000);
    } else {
      this.alert = false;
    }

    this._active = value;
  }

  constructor() {
  }

}
