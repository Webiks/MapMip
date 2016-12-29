import {Injectable} from '@angular/core';
import {Params, NavigationExtras} from "@angular/router";
import {isUndefined} from "util";
import * as _ from 'lodash';

@Injectable()
export class QueryParamsHelperService {

  constructor() { }

  queryBounds(params:Params):[number, number, number, number] {
    let boundsString = params['bounds'];
    let bounds:[number, number, number, number] = boundsString.split(',').map(strToNum => +strToNum);
    return bounds;
  }

  hasQueryBounds(params:Params):boolean {
    let boundsString = params['bounds'];
    return !isUndefined(boundsString)
  }
  queryLat(params:Params):number {
    return +params['lat'] || 0;
  }
  queryLng(params:Params):number {
    return +params['lng'] || 0;
  }
  queryZoom(params:Params):number {
    return +params['zoom'] || 0;
  }
  queryHeading(params:Params):number {
    return +params['heading'] || 0;
  }
  queryRoll(params:Params) {
    return +params['roll'] || 0;
  }
  queryHeight(params:Params):number {
    return +params["height"] || 0;
  }
  queryPitch(params:Params):number {
    return +params['pitch'] || -90;
  }
  queryMode3d(params:Params) {
    return +params['mode3d'] == 0 ? 0 : 1;
  }
  queryRotate(params:Params):number {
    if(isNaN(+params['rotate'])) return 0;
    return +params['rotate']  ;
  }

  queryMarkers(params:Params){
    let markersStr = params['markers'];
    if(!markersStr) return [];
    // markersStr = markersStr.split(" ").join("").split("),(").map((one, index) => index == 0 ? one + ")" : index + 1 === markersStr.split("),(").length ? "(" + one : "(" + one + ")");
    // let markers = markersStr.map(one => one.split("(").join("").split(")").join("").split(",").map((strToNum) => +strToNum));
    return this.markersStrToArray(markersStr);
  }

  markersStrToArray(markersStr:string) {
    let markersArrayStr:Array<string> = markersStr.split(" ").join("").split("),(").map((one, index) => index == 0 ? one + ")" : index + 1 === markersStr.split("),(").length ? "(" + one : "(" + one + ")");
    let markersArrayNum:Array<any> = markersArrayStr.map(one => one.split("(").join("").split(")").join("").split(",").map((strToNum) => +strToNum));
    markersArrayNum.forEach((markerPos, index, array) => {
      if (_.size(markerPos) === 2) {
        markerPos.push(0);
        array[index] = markerPos;
      }
    });
    return markersArrayNum;
  }

  markersArrayToStr(markersArray:Array<any>):string {
    return _.size(markersArray) != 0 ? "(" + markersArray.join("),(") + ")" : "";
  }

  anyMarkersParamsChanges(prevParams:Params, currentParams:Params): boolean{
    let currentMarkers = this.queryMarkers(currentParams);
    let prevMarkers = this.queryMarkers(prevParams);
    return !_.isEqual(currentMarkers, prevMarkers) ;
  }


  getQuery(queryObj):NavigationExtras {
    queryObj.roll =  queryObj.roll % 360  == 0 ? undefined : queryObj.roll;
    queryObj.heading = queryObj.heading % 360  == 0 ? undefined : queryObj.heading;
    queryObj.pitch = queryObj.pitch == -90 ? undefined : queryObj.pitch;
    queryObj.mode3d = queryObj.mode3d == 0 ? queryObj.mode3d : undefined;
    queryObj.rotate = queryObj.rotate == 0 ? undefined : queryObj.rotate;
    queryObj.markers = _.isEmpty(queryObj.markers) ? undefined : queryObj.markers;

    return <NavigationExtras> {
      queryParams: queryObj
    };
  }

}
