import {Injectable} from '@angular/core';
import {Params, NavigationExtras} from "@angular/router";
import * as _ from 'lodash';
import {CalcService} from "./calc-service";
declare let rison;

@Injectable()
export class QueryParamsHelperService {

  constructor(private calcService:CalcService) {}

  queryBounds(params:Params):[number, number, number, number] {
    let boundsString = params['bounds'];
    let bounds:[number, number, number, number] = boundsString.split(',').map(strToNum => +strToNum);
    return bounds;
  }

  hasQueryBounds(params:Params):boolean {
    let boundsString = params['bounds'];
    return !_.isEmpty(boundsString)
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

  queryMarkers(params:Params):Array<[number, number, number]>{
    let markersStr = params['markers'];
    if(!markersStr) return [];
    let marker_str_to_array = this.markersStrToArray(markersStr);
    let marker_str_to_array_fixed7 = marker_str_to_array.map( markerPos => this.calcService.toFixes7Obj(markerPos));
    return marker_str_to_array_fixed7;
  }

  anyTmsChanges(prev:Params, current:Params):boolean{
    let currentTms = this.queryTms(current);
    let prevTms = this.queryTms(prev);
    return !_.isEqual(prevTms, currentTms);
  }

  queryTms(params:Params):Array<string>{
    return this.queryTmsStrings(params);
  }

  queryTmsStrings(params:Params):Array<string>{
    let decode_tms_array:Array<Object> = this.queryTmsStringToObjects(params);
    return decode_tms_array.map( tms_obj => this.tmsObjecttToUrl(tms_obj));
  }

  queryTmsStringToObjects(params:Params):Array<Object>{
    let tms_to_decode:string = params['tms'];
    if(_.isEmpty(tms_to_decode) ) tms_to_decode = '';
    tms_to_decode = tms_to_decode.split(" ").join("");
    return rison.decode_array(tms_to_decode);
  }

  queryTmsObjectToString(tms_obj):string{
    if(_.isEmpty(tms_obj)) return "";
    return rison.encode_array(tms_obj);
  }

  tmsObjecttToUrl(tms_obj):string {
    let obj = _.cloneDeep(tms_obj);
    let url = obj.url;
    delete obj.url;
    Object.keys(obj).forEach( (val,index,array) => {
      if(index == 0 ) {
        url += '?';
      } else {
        url += '&';
      }
      url += `${val}=${obj[val]}`
    });
    return url;
  }

  queryMarkersNoHeight(params:Params):Array<[number, number]> {
    return this.queryMarkers(params).map((position:[number,number, number]) => <[number, number]> [position[0], position[1]]);
  }

  markersStrToArray(markersStr:string="") {
    if(_.isEmpty(markersStr)) return [];
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
    queryObj.roll    =  queryObj.roll % 360  == 0 ? undefined : queryObj.roll;
    queryObj.heading = queryObj.heading % 360  == 0 ? undefined : queryObj.heading;
    queryObj.pitch   = queryObj.pitch == -90 ? undefined : queryObj.pitch;
    queryObj.mode3d  = queryObj.mode3d == 0 ? queryObj.mode3d : undefined;
    queryObj.rotate  = queryObj.rotate == 1 ? 1 : undefined;
    queryObj.markers = _.isEmpty(queryObj.markers) ? undefined : queryObj.markers;
    queryObj.tms     = _.isEmpty(queryObj.tms) ? undefined : queryObj.tms;

    return <NavigationExtras> {
      queryParams: queryObj
    };
  }

}
