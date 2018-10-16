import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as MARKERS_COLOR_JSON from '../../../assets/Markers/Markers.json';
import { config } from '../../../config/config';

export const MARKER_COLORS: any = MARKERS_COLOR_JSON.default;
export const MARKER_COLORS_HEX: Array<string> = ['#277fca', '#3c3c3c', '#23aa1f', '#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];

@Injectable()
export class PositionFormService {

  public onPicked: boolean;
  public onPolygonPicked: boolean;
  public onPolylinePicked: boolean;
  public markerLabel = config.defaultMarker.label;

  public selectedColorIndex = this.getSelectedColorIndex(config.defaultMarker.icon);
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
    return MARKER_COLORS[index].icon;
  }

  getSelectedColorIndex(icon: string = this.getSelectedColor()): number {
    return MARKER_COLORS.findIndex((marker) => marker.icon === icon);
  }

  getSelectedColorHEX(index: number = this.selectedColorIndex): string {
    return MARKER_COLORS_HEX[index];
  }

  getMarkerCursorStyle(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(/assets/Markers/marker-icon-${this.getSelectedColor()}.cur), default`);
  }

  getMarkerUrlByColor(color = config.defaultMarker.icon, format = 'png'): string {
    return `/assets/Markers/marker-icon-${color}.${format}`;
  }

  getMarkerColorByUrl(url: string) {
    // return url.replace(location.origin, "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
    if (url) {
      return url.replace(location.origin, '').replace('/assets/Markers/marker-icon-', '').replace('.png', '');
    }
  }
}
