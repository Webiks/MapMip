import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class CalcService {

  constructor() {
  }

  toDegrees(radian: number) {
    let deg: number = Cesium.Math.toDegrees(radian);
    return ((deg % 360) + 360) % 360;
  }

  toRadians(degree: number) {
    let pos_degree = ((degree % 360) + 360) % 360;
    return Cesium.Math.toRadians(pos_degree);
  }

  toFixes7Obj(obj) {
    _.forEach(obj, (val: number, key) => {
      if (!isNaN(val)) {
        obj[key] = +(+val).toFixed(7);
      }
    });
    return obj;
  }

  getParsedUrlWithSubdomain(url: string): string {
    if (!url.includes('{s}')) {
      return url;
    }

    let cesium_imagery_provider = new Cesium.UrlTemplateImageryProvider({
      url
    });
    let subdomains_array = cesium_imagery_provider._subdomains;
    let parsed_subdomains = `{${_.isEmpty(subdomains_array) ? '' : subdomains_array [0] + '-' + subdomains_array [subdomains_array.length - 1]}}`;
    return url.replace('{s}', parsed_subdomains);
  }

}
