import { Injectable } from '@angular/core';

@Injectable()
export class CalcService {

  EARTH_CIRCUMFERENCE:number = 40075016.686;

  constructor() { }


  zoomLevelToDistance(lat:number, zoom:number) {
    let metresPerPixel = this.EARTH_CIRCUMFERENCE * Math.abs(Math.cos(lat * 180/Math.PI)) / Math.pow(2, zoom + 8);
    return metresPerPixel;
  }

  distanceToZoomLevel(lat:number, metresPerPixel:number):number {
    let x = (Math.abs(Math.cos(lat * 180/Math.PI)) * this.EARTH_CIRCUMFERENCE) / (metresPerPixel * Math.pow(2, 8));
    let z = Math.log(x) / Math.LN2;
    return z;
  }

}
