import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

export const MARKER_COLORS: Array<any> = [
  { color: 'blue', width: 36, height: 48 }, { color: 'black', width: 36, height: 48 }, {
    color: 'green',
    width: 36,
    height: 48
  },
  { color: 'gray', width: 36, height: 48 }, { color: 'orange', width: 36, height: 48 }, {
    color: 'yellow',
    width: 36,
    height: 48
  },
  { color: 'red', width: 36, height: 48 }, { color: 'violet', width: 36, height: 48 }, {
    color: 'coffee',
    width: 36,
    height: 48
  },
  { color: 'star', width: 36, height: 48 }, { color: 'home', width: 36, height: 48 }, {
    color: 'airport',
    width: 36,
    height: 48
  },
  { color: 'tools', width: 36, height: 48 }, { color: 'train', width: 36, height: 48 }, {
    color: 'tree',
    width: 36,
    height: 48
  },
  { color: 'lock', width: 36, height: 48 }, { color: 'hazard', width: 36, height: 48 }, {
    color: 'hotel',
    width: 36,
    height: 48
  },
  { color: 'gov', width: 36, height: 48 }, { color: 'dollar', width: 36, height: 48 }, {
    color: 'conversation',
    width: 36,
    height: 48
  },
  { color: 'rest', width: 36, height: 48 }, { color: 'man', width: 36, height: 48 }, {
    color: 'fire',
    width: 36,
    height: 48
  },
  { color: 'coffee2', width: 36, height: 48 },
  { color: 'conversation2', width: 36, height: 48 },
  { color: 'dollar2', width: 36, height: 48 },
  { color: 'fire2', width: 36, height: 48 },
  { color: 'gov2', width: 36, height: 48 },
  { color: 'hazard2', width: 36, height: 48 },
  { color: 'home2', width: 36, height: 48 },
  { color: 'hotel2', width: 36, height: 48 },
  { color: 'lock2', width: 36, height: 48 },
  { color: 'man2', width: 36, height: 48 },
  { color: 'rest2', width: 36, height: 48 },
  { color: 'star2', width: 36, height: 48 },
  { color: 'tools2', width: 36, height: 48 },
  { color: 'train2', width: 36, height: 48 },
  { color: 'tree2', width: 36, height: 48 },
  { color: 'fire_', width: 36, height: 48 },
  { color: 'fire1a', width: 60, height: 80 },
  { color: 'fire1b', width: 60, height: 80 },
  { color: 'fire4a', width: 36, height: 48 },
  { color: 'fire4b', width: 36, height: 48 },
  { color: 'fire5', width: 36, height: 48 },
  { color: 'lock1a', width: 60, height: 80 },
  { color: 'lock1b', width: 60, height: 80 },
  { color: 'lock4a', width: 36, height: 48 },
  { color: 'lock4b', width: 36, height: 48 },
  { color: 'lock5', width: 36, height: 48 },
  { color: 'lock5c', width: 36, height: 48 }];


export const MARKER_COLORS_HEX: Array<string> = ['#277fca', '#3c3c3c', '#23aa1f', '#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];

@Injectable()
export class PositionFormService {

  public onPicked: boolean;
  public onPolygonPicked: boolean;
  public onPolylinePicked: boolean;


  public selectedColorIndex: number = 0;
  public markerPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public polygonPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public polylinePickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mapsCont: any;
  public hideComponent: boolean = true;

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
    //return MARKER_COLORS.indexOf(color);
    return this.search(color, MARKER_COLORS);
  }

  search(nameKey: string, myArray: Array<any>): number {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].color === nameKey) {
        return i;
      }
    }
  }

  getSelectedColorHEX(index: number = this.selectedColorIndex): string {
    return MARKER_COLORS_HEX[index];
  }

  getMarkerCursorStyle(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(http://mapmip.webiks.com/assets/Markers/marker-icon-${this.getSelectedColor()}.cur), default`);
  }

  getMarkerUrlByColor(color: string = 'blue', format: string = 'png'): string {
    return `http://mapmip.webiks.com/assets/Markers/marker-icon-${color}.${format}`;
  }

  getMarkerColorByUrl(url: string) {
    // return url.replace(location.origin, "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
    if (url) {
      return url.replace('http://mapmip.webiks.com', '').replace('/assets/Markers/marker-icon-', '').replace('.png', '');
    }
  }
}
