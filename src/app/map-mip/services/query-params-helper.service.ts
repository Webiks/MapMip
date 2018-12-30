import { Injectable } from '@angular/core';
import { NavigationExtras, Params, Router, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { MapMipService } from '../api/map-mip.service';
import * as rison from 'rison';
import { config } from '../../../config/config';

export interface MapMipMarker {
  position: number[];
  icon?: string;
  label?: string;
}

@Injectable()
export class QueryParamsHelperService {

  public polygons_array: Array<any> = [];

  constructor(private router: Router, private mapMipService: MapMipService) {
  }

  queryBounds(params: Params): [number, number, number, number] {
    let boundsString = params['bounds'];
    let bounds: [number, number, number, number] = boundsString.split(',').map(strToNum => +strToNum);
    return bounds;
  }

  hasQueryBounds(params: Params): boolean {
    let boundsString = params['bounds'];
    return !_.isEmpty(boundsString);
  }

  queryLat(params: Params): number {
    return +params['lat'] || 0;
  }

  queryLng(params: Params): number {
    return +params['lng'] || 0;
  }

  queryZoom(params: Params): number {
    return +params['zoom'] || 0;
  }

  queryHeading(params: Params): number {
    return +params['heading'] || 0;
  }

  queryRoll(params: Params) {
    return +params['roll'] || 0;
  }

  queryHeight(params: Params): number {
    return +params['height'] || 0;
  }

  queryPitch(params: Params): number {
    return +params['pitch'] || -90;
  }

  queryMode3d(params: Params) {
    return +params['mode3d'] === 0 ? 0 : 1;
  }

  queryRotate(params: Params): number {
    return +params['rotate'];
  }

  querySize(params: Params): [number, number] {
    let size = params['size'];
    if (_.isEmpty(size)) {
      return [100, 100];
    }
    return size.split(',').map(str => +str);
  }

  queryTerrain(params: Params): string {
    return params['terrain'];
  }

  queryGeoJson(params: Params): string[] {
    return this.geojsonStrToArray(params['geojson']);
  }

  queryLighting(params: Params): number {
    if (+params['lighting'] !== 1) {
      return 0;
    }
    return 1;
  }

  queryPosition(params: Params): [number, number] {
    let position = params['position'];
    if (_.isEmpty(position)) {
      return [50, 50];
    }
    return position.split(',').map(str => +str);
  }

  queryPolygons(params: Params): Array<any> {
    return this.polygonsStrToArray(params['polygons']);

  }

  queryPolyline(params: Params): Array<any> {
    return this.polylineStrToArray(params['polyline']);

  }

  anySizeChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.querySize(prevParams);
    let currentSize = this.querySize(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyTerrainChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.queryTerrain(prevParams);
    let currentSize = this.queryTerrain(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyGeoJsonChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.queryGeoJson(prevParams);
    let currentSize = this.queryGeoJson(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyPolygonsChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.queryPolygons(prevParams);
    let currentSize = this.queryPolygons(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyPolylineChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.queryPolyline(prevParams);
    let currentSize = this.queryPolyline(currentParams);
    return !_.isEqual(prevSize, currentSize);
  }

  anyLightingChange(prevParams: Params, currentParams: Params) {
    let prevLighting = this.queryLighting(prevParams);
    let currentLighting = this.queryLighting(currentParams);
    return !_.isEqual(prevLighting, currentLighting);
  }

  anyPositionChange(prevParams: Params, currentParams: Params) {
    let prevSize = this.queryPosition(prevParams);
    let currentSize = this.queryPosition(currentParams);
    return !_.isEqual(prevSize, currentSize);
  };

  addMarker(marker: MapMipMarker) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    let markers_array: Array<any> = this.markersStrToArray(urlTree.queryParams['markers']);
    markers_array.push(marker);
    urlTree.queryParams['markers'] = this.markersArrayToStr(markers_array);
    this.mapMipService.navigateByUrl(urlTree.toString());
  }

  addPolyline(coords: number[]) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    const polyline_url = urlTree.queryParams['polyline'] || '';
    const polyline_array = rison.decode_array(polyline_url);
    polyline_array.push({ coords });
    urlTree.queryParams['polyline'] = rison.encode_array(polyline_array);
    this.mapMipService.navigateByUrl(urlTree.toString());
  }

  addPolygon(coords: number[]) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    const polygons_url = urlTree.queryParams['polygons'] || '';
    const polygons_array = rison.decode_array(polygons_url);
    polygons_array.push({ coords });
    urlTree.queryParams['polygons'] = rison.encode_array(polygons_array);
    this.mapMipService.navigateByUrl(urlTree.toString());
  }

  removeMarker(marker) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    let markers_array: Array<any> = this.markersStrToArray(urlTree.queryParams['markers']);
    _.forEach(markers_array, function (m, index) {
      if (marker.position[0] === m.position[0] && marker.position[1] === m.position[1] && marker.icon === m.icon) {
        markers_array.splice(index, 1);
      }
    });
    urlTree.queryParams['markers'] = this.markersArrayToStr(markers_array);
    this.mapMipService.navigateByUrl(urlTree.toString());
  }

  addGeojson(geojson) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    let geojson_array: Array<any> = this.geojsonStrToArray(urlTree.queryParams['geojson']);
    geojson_array.push(geojson);
    urlTree.queryParams['geojson'] = this.geojsonArrayToStr(geojson_array);
    this.mapMipService.navigateByUrl(urlTree.toString());
  }

  queryMarkers(params: Params): Array<MapMipMarker> {
    return this.markersStrToArray(params['markers']).map(this.markerIncludeDefaults.bind(this));
  }


  anyLayersChanges(prev: Params, current: Params): boolean {
    let currentLayers = this.queryLayers(current);
    let prevLayers = this.queryLayers(prev);

    return !_.isEqual(currentLayers, prevLayers);
  }

  queryLayers(params: Params): Array<Object> {
    let decode_array = this.queryLayersStrings(params);
    decode_array.forEach(layer_obj => {
      _.forEach(layer_obj, (val, key, obj) => {
        obj[key] = decodeURIComponent(<any>val);
      });
    });
    return decode_array;
  }

  queryLayersStrings(params: Params): Array<Object> {
    return this.queryLayersStringToObjects(params);
  }

  queryLayersStringToObjects(params: Params): Array<Object> {
    let layer_to_decode: string = params['layers'];
    if (_.isEmpty(layer_to_decode)) {
      layer_to_decode = '';
    }
    layer_to_decode = layer_to_decode.split(' ').join('');
    return rison.decode_array(layer_to_decode);
  }

  queryGeojsonStringToObjects(params: Params): Array<Object> {
    let geojson_to_decode: string = params['geojson'];
    if (_.isEmpty(geojson_to_decode)) {
      geojson_to_decode = '';
    }
    geojson_to_decode = geojson_to_decode.split(' ').join('');
    return rison.decode_array(geojson_to_decode);
  }

  queryLayersObjectToString(tms_obj): string {
    if (_.isEmpty(tms_obj)) {
      return '';
    }
    return rison.encode_array(tms_obj);
  }

  queryGeoJsonObjectToString(tms_obj): string {
    if (_.isEmpty(tms_obj)) {
      return '';
    }
    return rison.encode_array(tms_obj);
  }

  layerObjectToUrl(layer_obj): string {
    let obj = _.cloneDeep(layer_obj);
    let url = obj.url;
    delete obj.url;
    Object.keys(obj).forEach((val, index, array) => {
      if (index === 0) {
        url += '?';
      } else {
        url += '&';
      }
      url += `${val}=${obj[val]}`;
    });
    return url;
  }

  queryMarkersNoHeight(params: Params) {
    let markers = this.queryMarkers(params);
    markers.forEach(marker => {
      marker.position = [marker.position[0], marker.position[1]];
    });
    return markers;
  }

  polygonsStrToArray(polygonStr = ''): Array<any> {
    return rison.decode_array(polygonStr);
  }

  polygonsArrayToStr(polygonArray = []): string {
    return rison.encode(polygonArray);
  }

  polylineStrToArray(polylineStr = rison.encode([])): Array<any> {
    return rison.decode(polylineStr);
  }

  markersStrToArray(markersStr = rison.encode([])): MapMipMarker[] {
    return rison.decode(markersStr);
  }

  markersArrayToStr(markersArray: MapMipMarker[] = []): string {
    markersArray.forEach(this.markerExcludeDefaults.bind(this));
    return rison.encode(markersArray);
  }

  markerExcludeDefaults(marker: MapMipMarker): void {
    Object.keys(marker).forEach((key) => {
      if (!marker[key] || marker[key] === config.defaultMarker[key]) {
        delete marker[key];
      }
    });
  }

  markerIncludeDefaults(marker: MapMipMarker): MapMipMarker {
    return {
      ...marker,
      icon: marker.icon || config.defaultMarker.icon,
      label: marker.label || config.defaultMarker.label
    };
  }

  geojsonStrToArray(geojsonStr: string) {
    if (_.isEmpty(geojsonStr)) {
      return [];
    }
    let geojsonArrayStr: Array<string> = geojsonStr.split(' ').join('').split('),(').map(
      (str, index, array) => {
        if (index === 0) {
          str = str.replace('(', '');
        }
        if (index === array.length - 1) {
          str = str.replace(')', '');
        }
        return str;
      });

    return geojsonArrayStr;
  }


  geojsonArrayToStr(geojsonArray: Array<any>): string {
    let url_str = '';

    geojsonArray.forEach((geojsonObj, index, array) => {
      let one_array_str = '';
      one_array_str += geojsonObj;
      one_array_str = '(' + geojsonObj + '),';
      one_array_str = index === (array.length - 1) ? one_array_str.replace('),', ')') : one_array_str;
      url_str += one_array_str;
    });

    return url_str;
  }

  anyMarkersParamsChanges(prevParams: Params, currentParams: Params): boolean {
    let currentMarkers = this.queryMarkers(currentParams);
    let prevMarkers = this.queryMarkers(prevParams);
    return !_.isEqual(currentMarkers, prevMarkers);
  }


  getQuery(queryObj): NavigationExtras {
    queryObj.roll = queryObj.roll % 360 === 0 ? undefined : queryObj.roll;
    queryObj.heading = queryObj.heading % 360 === 0 ? undefined : queryObj.heading;
    queryObj.pitch = queryObj.pitch === -90 ? undefined : queryObj.pitch;
    queryObj.mode3d = queryObj.mode3d === 0 ? queryObj.mode3d : undefined;
    // queryObj.rotate  = queryObj.rotate ===  1 ? 1 : undefined;
    queryObj.markers = _.isEmpty(queryObj.markers) ? undefined : queryObj.markers;
    queryObj.layers = _.isEmpty(queryObj.layers) ? undefined : queryObj.layers;
    queryObj.size = _.isEqual(queryObj.size, '100,100') ? undefined : queryObj.size;
    queryObj.position = _.isNil(queryObj.size) || _.isEqual(queryObj.position, '50,50') ? undefined : queryObj.position;
    queryObj.terrain = _.isEmpty(queryObj.terrain) ? undefined : queryObj.terrain;
    queryObj.lighting = _.isEqual(this.queryLighting({ lighting: queryObj.lighting }), 1) ? queryObj.lighting : undefined;
    queryObj.geojson = _.isEmpty(this.queryGeoJson({ geojson: queryObj.geojson })) ? undefined : queryObj.geojson;
    queryObj.polygons = _.isEmpty(this.queryPolygons({ polygons: queryObj.polygons })) ? undefined : queryObj.polygons;
    queryObj.polyline = _.isEmpty(this.queryPolyline({ polyline: queryObj.polyline })) ? undefined : queryObj.polyline;

    return <NavigationExtras> {
      queryParams: queryObj
    };
  }

}
