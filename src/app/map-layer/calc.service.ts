import { Injectable } from '@angular/core';

@Injectable()
export class CalcService {

  EARTH_CIRCUMFERENCE:number = 40075016.686;

  constructor() { }


  zoomLevelToDistance(lat:number, zoom:number) {
    const a = Math.abs(Math.cos(lat));
    const b = a * this.EARTH_CIRCUMFERENCE;
    const c = Math.pow(2, 8);
    const d = Math.pow(2, zoom);
    const e = c * d;
    const metresPerPixel = b / e;

    return metresPerPixel;
  }

  distanceToZoomLevel(lat:number, metresPerPixel:number):number {
    const a = Math.abs(Math.cos(lat));
    const b = a * this.EARTH_CIRCUMFERENCE;
    const c = Math.pow(2, 8);
    const d = c * metresPerPixel;
    const result = b / d;


    let z = Math.log(result) / Math.LN2;
    return z;
  }

}
