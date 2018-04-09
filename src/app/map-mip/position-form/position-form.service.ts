import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import MARKERS_COLOR_JSON from '../../../assets/Markers/Markers.json';
import { config } from '../../../config/config';

export const MARKER_COLORS = MARKERS_COLOR_JSON;
export const MARKER_COLORS_HEX: Array<string> = ['#277fca', '#3c3c3c', '#23aa1f', '#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];

@Injectable()
export class PositionFormService {

  public onPicked: boolean;
  public onPolygonPicked: boolean;
  public onPolylinePicked: boolean;


  public selectedColorIndex = 0;
  public markerPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public polygonPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public polylinePickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mapsCont: any;
  public hideComponent = config.hidePositionForm;

  constructor(private domSanitizer: DomSanitizer) {
  }

  getSelectedMarkerWidth(): number {
    return MARKER_COLORS[this.getSelectedColorIndex()].width;
  }

  getSelectedMarkerHeight(): number {
    return MARKER_COLORS[this.getSelectedColorIndex()].height;
  }

  getSelectedColor(index: number = this.selectedColorIndex): string {
    return MARKER_COLORS[index].color;
  }

  getSelectedColorIndex(color: string = this.getSelectedColor()): number {
    // return MARKER_COLORS.indexOf(color);
    return this.search(color, MARKER_COLORS);
  }

  search(nameKey: string, myArray: Array<any>): number {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].color === nameKey) {
        return i;
      }
    }
  }

  getSelectedColorHEX(index: number = this.selectedColorIndex): string {
    return MARKER_COLORS_HEX[index];
  }

  getMarkerCursorStyle(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(/assets/Markers/marker-icon-${this.getSelectedColor()}.cur), default`);
  }

  getMarkerUrlByColor(color = 'blue', format = 'png'): string {
    return `/assets/Markers/marker-icon-${color}.${format}`;
  }

  getMarkerColorByUrl(url: string) {
    // return url.replace(location.origin, "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
    if (url) {
      return url.replace(location.origin, '').replace('/assets/Markers/marker-icon-', '').replace('.png', '');
    }
  }
}
