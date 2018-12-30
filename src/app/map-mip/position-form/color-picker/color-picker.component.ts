import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MARKER_COLORS, PositionFormService } from '../position-form.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  private _selectedIndex = 0;

  @Input()
  set selectedIndex(value) {
    this._selectedIndex = value;
    this.selectedIndexChange.emit(value);
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  @Input('Active') Active;
  @Output('togglePickedEmitter') togglePickedEmitter = new EventEmitter();
  @Output('selectedIndexChange') selectedIndexChange = new EventEmitter();
  @Input('disabledAction') disabledAction: boolean;
  @Input('iconsPerRow') public iconsPerRow: number;
  @Input('backdrop') public backdrop: boolean;

  @Output() labelChange = new EventEmitter();
  @Input() label = '';


  constructor(public positionFormService: PositionFormService) {
  }

  submitLabel(popDirective, label) {
    this.label = label;
    this.labelChange.emit(label);
    popDirective.hide();
  }

  get selectedColor(): string {
    return MARKER_COLORS[this.selectedIndex].icon;
  }

  changeMarkerColor(selectedColorIndex) {
    this.selectedIndex = selectedColorIndex;
    if (!this.Active) {
      this.togglePickedEmitter.emit(true);
    }
  }

  markerColors() {
    return MARKER_COLORS;
  }

  getMarkerUrlByColor(color: string): string {
    return this.positionFormService.getMarkerUrlByColor(color);
  }

  calcIndex(parentIndex: number, childIndex: number, iconsPerRow = 1) {
    return (iconsPerRow * parentIndex) + childIndex;
  }

}
