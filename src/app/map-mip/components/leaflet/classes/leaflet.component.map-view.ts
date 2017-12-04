import { LeafletComponent } from '../leaflet.component';
import { NavigationExtras, Params } from '@angular/router';
import * as _ from 'lodash';
import { MapMipService } from '../../../api/map-mip.service';
import * as L from 'leaflet';

export class LeafletMapView {
  public queryParamsSubscriber;
  public gotoEmitterSubscriber;

  constructor(private leaflet: LeafletComponent) {
    leaflet.map.on('moveend', this.moveEnd.bind(this));
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.gotoEmitterSubscriber = leaflet.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
  }

  queryParams(params: Params) {
    if (this.leaflet.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else {
      if (this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }


  moveEnd(event) {
    if (!this.anyParamChanges(this.leaflet.currentParams)) {
      return;
    }
    let lng: number = event.target.getCenter().lng;
    let lat: number = event.target.getCenter().lat;
    let zoom: number = event.target.getZoom();
    let markers = this.leaflet.currentParams['markers'];
    let layers = this.leaflet.currentParams['layers'];
    let size = this.leaflet.currentParams['size'];
    let position = this.leaflet.currentParams['position'];
    let geojson = this.leaflet.currentParams['geojson'];
    let polygons = this.leaflet.currentParams['polygons'];


    let navigationExtras: NavigationExtras = this.leaflet.queryParamsHelperService.getQuery({
      lng,
      lat,
      zoom,
      markers,
      layers,
      size,
      position,
      geojson,
      polygons
    });

    return this.leaflet.mapMipService.navigate([], navigationExtras);
  };


  setMapView(params: Params): void {
    let longitude: number = this.leaflet.queryParamsHelperService.queryLng(params);
    let latitude: number = this.leaflet.queryParamsHelperService.queryLat(params);
    let zoom: number = this.leaflet.queryParamsHelperService.queryZoom(params);

    this.leaflet.map.setView([latitude, longitude], zoom);
  }

  setMapBounds(params: Params): void {
    let bounds: [number, number, number, number] = this.leaflet.queryParamsHelperService.queryBounds(params);
    this.leaflet.map.fitBounds(<L.LatLngBoundsExpression> [[bounds[1], bounds[0]], [bounds[3], bounds[2]]], null);
  }

  anyParamChanges(params: Params): boolean {
    let longitudeP: number = this.leaflet.queryParamsHelperService.queryLng(params);
    let latitudeP: number = this.leaflet.queryParamsHelperService.queryLat(params);
    let zoomP: number = this.leaflet.queryParamsHelperService.queryZoom(params);

    let arrayP = [longitudeP, latitudeP, zoomP];

    let longitude: number;
    let latitude: number;
    let zoom: number;

    try {
      longitude = this.leaflet.map.getCenter().lng;
      latitude = this.leaflet.map.getCenter().lat;
      zoom = this.leaflet.map.getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP = this.leaflet.calcService.toFixes7Obj(arrayP);
    array = this.leaflet.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array);
  }

  getBounds(): [number, number, number, number] {
    let leaflet_bounds: L.LatLngBounds = this.leaflet.map.getBounds();
    let saved_bounds: [number, number, number, number] = [leaflet_bounds.getNorthWest().lng, leaflet_bounds.getNorthWest().lat, leaflet_bounds.getSouthEast().lng, leaflet_bounds.getSouthEast().lat];
    return saved_bounds;
  }

  setQueryBoundsOnNavigationEnd(state: string): void {
    let extras: NavigationExtras = {};
    switch (state) {
      case MapMipService.CESIUM_PATH:
        let bounds = this.getBounds().toString();
        let markers = this.leaflet.currentParams['markers'];
        let layers = this.leaflet.currentParams['layers'];
        let size = this.leaflet.currentParams['size'];
        let position = this.leaflet.currentParams['position'];
        let geojson = this.leaflet.currentParams['geojson'];
        let polygons = this.leaflet.currentParams['polygons'];
        extras.queryParams = { bounds, markers, layers, size, position, geojson, polygons };
        break;
      case MapMipService.OPENLAYERS_PATH:
        extras = { queryParamsHandling: 'preserve' };
        break;
    }
    this.leaflet.mapMipService.navigate([state], extras).then(() => {
      this.leaflet.map.off('moveend');
      this.gotoEmitterSubscriber.unsubscribe();
    });

  }
}


// let urlTree:UrlTree = this.leaflet.router.parseUrl(event);
// urlTree.queryParams['bounds'] = this.getBounds().toString();
// this.leaflet.mapMipService.navigateByUrl(urlTree.toString());
