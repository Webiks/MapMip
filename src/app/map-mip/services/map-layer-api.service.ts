import { Injectable } from '@angular/core';
import { QueryParamsHelperService } from './query-params-helper.service';
import { Router, UrlTree } from '@angular/router';
import { MapMipService } from '../api/map-mip.service';

@Injectable()
export class MapLayerApiService {

  constructor(private queryParamsHelperService: QueryParamsHelperService, private router: Router, private mapmipService: MapMipService) {

  }

  addMarker(marker) {
    this.queryParamsHelperService.addMarker(marker);
  }

  changePosition(lng: string, lat: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['lng'] = lng;
    urlTree.queryParams['lat'] = lat;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  // cesium specific
  cesiumChangeHeight(height: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('height')) {
      return;
    }
    urlTree.queryParams['height'] = height;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  // cesium & OL3 specific
  ChangeHeading(heading: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('heading')) {
      return;
    }
    urlTree.queryParams['heading'] = heading;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumChangePitch(pitch: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('pitch')) {
      return;
    }
    urlTree.queryParams['pitch'] = pitch;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumChangeRoll(roll: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('roll')) {
      return;
    }
    urlTree.queryParams['roll'] = roll;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumChangeMode3d(mode3d: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('mode3d') && mode3d !== '0' || mode3d === '') {
      return;
    }
    urlTree.queryParams['mode3d'] = mode3d;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumRotate(rotate: string) {
    let urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.queryParams['mode3d'] !== '0') {
      return;
    }
    if (rotate !== '1') {
      delete urlTree.queryParams['rotate'];
      this.mapmipService.router.navigateByUrl(urlTree.toString());
      return;
    }
    urlTree.queryParams['rotate'] = rotate;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumChangeTerrain(terrain: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['terrain'] = terrain;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  cesiumChangeLighting(lighting: string) {
    let urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['lighting'] = lighting;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  Ol3Rotate(rotate: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    if (!urlTree.queryParams.hasOwnProperty('rotate') && rotate !== '0' || rotate === '') {
      return;
    }
    urlTree.queryParams['rotate'] = rotate;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  changeSize(width: string, height: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['size'] = width + ',' + height;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  changeMapPositionInPage(width: string, height: string) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['position'] = width + ',' + height;
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  leafletChangeZoom(zoom: number) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['zoom'] = zoom.toString();
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  Ol3changeZoom(zoom: number) {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['zoom'] = (zoom < 20 ? zoom : 19).toString();
    this.mapmipService.router.navigateByUrl(urlTree.toString());
  }

  // goto(state: "leaflet" | "cesium" | "openlayers"):void{
  //   this.mapmipService.goTo(state);
  // }

  removeMarkerByPosition(marker) {
    this.queryParamsHelperService.removeMarker(marker);
  }


  addGeojson(geojson) {
    this.queryParamsHelperService.addGeojson(geojson);
  }


}
