import {Injectable} from '@angular/core';
import {Params, NavigationExtras, Router, UrlTree} from "@angular/router";
import * as _ from 'lodash';
import {CalcService} from "./calc-service";
declare let rison;

@Injectable()
export class QueryParamsHelperService{

  constructor(private calcService:CalcService, private router:Router) {}

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
    return +params['rotate'];
  }
  querySize(params:Params):[number,number]{
    let size = params['size'];
    if(_.isEmpty(size)) return [100,100];
    return size.split(",").map(str => +str);
  }
  queryPosition(params:Params):[number,number]{
    let position = params['position'];
    if(_.isEmpty(position)) return [50,50];
    return position.split(",").map(str => +str);
  }
  anySizeChange(prevParams:Params, currentParams:Params) {
    let prevSize = this.querySize(prevParams);
    let currentSize = this.querySize(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyPositionChange(prevParams:Params, currentParams:Params){
    let prevSize = this.queryPosition(prevParams);
    let currentSize = this.queryPosition(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  addMarker(marker){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let markers_array:Array<any> = this.markersStrToArray(urlTree.queryParams['markers']);
    markers_array.push(marker);
    urlTree.queryParams['markers'] = this.markersArrayToStr(markers_array);
    this.router.navigateByUrl(urlTree.toString())
  }

  queryMarkers(params:Params):Array<{position:number[],color:string}>{
    return this.markersStrToArray(params['markers']);
  }

  anyLayersChanges(prev:Params, current:Params):boolean{
    let currentLayers = this.queryLayers(current);
    let prevLayers  = this.queryLayers(prev);
    return !_.isEqual(currentLayers, prevLayers);
  }

  queryLayers(params:Params):Array<Object>{
    let decode_array = this.queryLayersStrings(params);
    decode_array.forEach(layer_obj => {
      _.forEach(layer_obj, (val, key, obj) => {obj[key] = decodeURIComponent(val)});
    });
    return decode_array;
  }

  queryLayersStrings(params:Params):Array<Object>{
    return this.queryLayersStringToObjects(params);
  }

  queryLayersStringToObjects(params:Params):Array<Object>{
    let layer_to_decode:string = params['layers'];
    if(_.isEmpty(layer_to_decode) ) layer_to_decode = '';
    layer_to_decode = layer_to_decode.split(" ").join("");
    return rison.decode_array(layer_to_decode);
  }

  queryLayersObjectToString(tms_obj):string{
    if(_.isEmpty(tms_obj)) return "";
    return rison.encode_array(tms_obj);
  }

  layerObjecttToUrl(layer_obj):string {
    let obj = _.cloneDeep(layer_obj);
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

  queryMarkersNoHeight(params:Params) {
    let markers = this.queryMarkers(params);
    markers.forEach(marker => {marker.position = [marker.position[0], marker.position[1]]});
    return markers;
  }

  markersStrToArray(markersStr:string="") {
    if(_.isEmpty(markersStr)) return [];
    let markersArrayStr:Array<string> = markersStr.split(" ").join("").split("),(").map(
      (str, index, array) => {
        if(index == 0){
          str = str.replace("(", "")
        }
        if(index == array.length - 1) {
          str = str.replace(")", "")
        }
        return str
      });

    let markersArrayObject:Array<any> = markersArrayStr.map((one:string) => {
      let split_array:Array<any> = one.split(",");
      let position = split_array.filter(i => !isNaN(+i)).map(i => +(+i).toFixed(7));
      let color:string = split_array.find(i => isNaN(+i));
      let marker_obj = {position};
      if(color) marker_obj['color']= color;
      return marker_obj;
    });

    return markersArrayObject;
  }

  markersArrayToStr(markersArray:Array<any>):string {
    let url_str = "";

    markersArray.forEach( (markersObj, index, array) => {
      let one_array_str:string = "";
      one_array_str += markersObj.position;
      one_array_str = markersObj.color ? one_array_str + "," + markersObj.color: one_array_str;
      one_array_str = "(" + one_array_str + "),";
      one_array_str = index == (array.length - 1) ? one_array_str.replace("),", ")") : one_array_str;
      url_str += one_array_str;
    });

    return url_str;
  }

  anyMarkersParamsChanges(prevParams:Params, currentParams:Params): boolean{
    let currentMarkers = this.queryMarkers(currentParams);
    let prevMarkers = this.queryMarkers(prevParams);
    return !_.isEqual(currentMarkers, prevMarkers) ;
  }


  getQuery(queryObj):NavigationExtras {
    queryObj.roll         =  queryObj.roll % 360  == 0 ? undefined : queryObj.roll;
    queryObj.heading      = queryObj.heading % 360  == 0 ? undefined : queryObj.heading;
    queryObj.pitch        = queryObj.pitch == -90 ? undefined : queryObj.pitch;
    queryObj.mode3d       = queryObj.mode3d == 0 ? queryObj.mode3d : undefined;
    // queryObj.rotate  = queryObj.rotate == 1 ? 1 : undefined;
    queryObj.markers      = _.isEmpty(queryObj.markers) ? undefined : queryObj.markers;
    queryObj.layers       = _.isEmpty(queryObj.layers) ? undefined : queryObj.layers;
    queryObj.size         = _.isEqual(queryObj.size, "100,100") ? undefined : queryObj.size;
    queryObj.position    =  _.isNil(queryObj.size) || _.isEqual(queryObj.position, "50,50")  ? undefined : queryObj.position;

    return <NavigationExtras> {
      queryParams: queryObj
    };
  }

}
