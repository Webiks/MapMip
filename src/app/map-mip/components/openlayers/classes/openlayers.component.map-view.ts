import { OpenlayersComponent } from '../openlayers.component';
import { Observable, Observer } from 'rxjs';
import { NavigationExtras, Params } from '@angular/router';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { olx } from 'openlayers';
import { MapMipService } from '../../../api/map-mip.service';

export class OpenlayersMapView {
  public go_north = false;
  public andRotation: (boolean) => void;
  public DragRotateInteractions: ol.interaction.DragRotate;
  public moveEndEvent;
  public queryParamsSubscriber;
  public gotoEmitterSubscriber;

  constructor(private openlayers: OpenlayersComponent) {

    this.DragRotateInteractions = openlayers.map.getInteractions().getArray().find(i => i instanceof ol.interaction.DragRotate);
    this.moveEndEvent = openlayers.map.on('moveend', this.moveEnd.bind(this));
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.gotoEmitterSubscriber = openlayers.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
  }

  queryParams(params: Params): void {
    if (this.openlayers.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if (this.anyParamChanges(params)) {
      this.setMapView(params);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  onLeaveToLeaflet(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.andRotation = (complete: boolean) => {
        observer.next(complete);
      };
      if (this.openlayers.map.getView().getRotation() === 0) {
        observer.next(true);
      } else {
        let radian_rotation = this.openlayers.map.getView().getRotation();
        let north = this.openlayers.calcService.toDegrees(radian_rotation) < 180 ? 0 : Cesium.Math.toRadians(360);
        this.openlayers.map.getView().animate({ rotation: north, duration: 500 }, this.andRotation);
      }
    });
  };

  setMapView(params: Params): void {
    let rotate: boolean = isNaN(this.openlayers.queryParamsHelperService.queryRotate(params)) ? true : false;

    this.openlayers.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.openlayers.queryParamsHelperService.queryLng(params), this.openlayers.queryParamsHelperService.queryLat(params)]),
      zoom: this.openlayers.queryParamsHelperService.queryZoom(params),
      minZoom: 3,
      maxZoom: 19,
      rotation: this.openlayers.calcService.toRadians(360 - this.openlayers.queryParamsHelperService.queryHeading(params))
    }));

    this.DragRotateInteractions.setActive(rotate);
  }

  setMapBounds(params: Params): void {
    let bounds: [number, number, number, number] = this.openlayers.queryParamsHelperService.queryBounds(params);
    let heading: number = this.openlayers.calcService.toRadians(360 - this.openlayers.queryParamsHelperService.queryHeading(params));

    this.openlayers.map.getView().fit(this.openlayers.transformExtent(bounds), { size: this.openlayers.map.getSize() });
    this.openlayers.map.getView().setRotation(heading);
  }

  anyParamChanges(params: Params): boolean {
    let longitudeP: number = this.openlayers.queryParamsHelperService.queryLng(params);
    let latitudeP: number = this.openlayers.queryParamsHelperService.queryLat(params);
    let zoomP: number = this.openlayers.queryParamsHelperService.queryZoom(params);
    let headingP: number = 360 - this.openlayers.queryParamsHelperService.queryHeading(params);
    let rotateP: number = isNaN(this.openlayers.queryParamsHelperService.queryRotate(params)) ? 1 : 0;

    let arrayP = [longitudeP, latitudeP, zoomP, headingP, rotateP];

    let longitude: number;
    let latitude: number;
    let zoom: number;
    let heading: number;
    let rotate: number;

    try {
      longitude = this.openlayers.map.getView().getCenter()[0];
      latitude = this.openlayers.map.getView().getCenter()[1];
      zoom = this.openlayers.map.getView().getZoom();
      heading = this.openlayers.calcService.toDegrees(this.openlayers.map.getView().getRotation());
      rotate = this.DragRotateInteractions.getActive() ? 1 : 0;
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom, heading, rotate];

    arrayP = this.openlayers.calcService.toFixes7Obj(arrayP);
    array = this.openlayers.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array);
  }

  moveEnd(event): Promise<boolean> {
    let centerCord: ol.Coordinate = ol.proj.transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');

    let lng = centerCord[0];
    let lat = centerCord[1];
    let zoom: number = event.map.getView().getZoom();
    let heading: number = 360 - this.openlayers.calcService.toDegrees(event.map.getView().getRotation());
    let markers = this.openlayers.currentParams['markers'];
    let layers = this.openlayers.currentParams['layers'];
    let rotate = this.openlayers.currentParams['rotate'];
    let size = this.openlayers.currentParams['size'];
    let position = this.openlayers.currentParams['position'];
    let geojson = this.openlayers.currentParams['geojson'];
    let polygons = this.openlayers.currentParams['polygons'];

    rotate = rotate === 0 ? 0 : undefined;

    let navigationExtras: NavigationExtras = this.openlayers.queryParamsHelperService.getQuery({
      lng,
      lat,
      zoom,
      heading,
      markers,
      layers,
      rotate,
      size,
      position,
      geojson,
      polygons
    });
    return this.openlayers.mapMipService.navigate([], navigationExtras);
  };

  getBounds(): [number, number, number, number] {
    let current_rotation: number = this.openlayers.map.getView().getRotation();
    this.openlayers.map.getView().setRotation(0);
    let bounds: ol.Extent = this.openlayers.map.getView().calculateExtent(this.openlayers.map.getSize());
    this.openlayers.map.getView().setRotation(current_rotation);
    let t_bounds: ol.Extent = ol.proj.transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');
    let saved_bounds: [number, number, number, number] = t_bounds;
    return saved_bounds;
  }

  setQueryBoundsOnNavigationEnd(state: string): void {
    let extras: NavigationExtras = {};

    switch (state) {

      case MapMipService.CESIUM_PATH:
        let bounds = this.getBounds().toString();
        let heading = this.openlayers.queryParamsHelperService.queryHeading(this.openlayers.currentParams);
        let markers = this.openlayers.currentParams['markers'];
        let layers = this.openlayers.currentParams['layers'];
        let size = this.openlayers.currentParams['size'];
        let position = this.openlayers.currentParams['position'];
        let geojson = this.openlayers.currentParams['geojson'];
        let polygons = this.openlayers.currentParams['polygons'];
        extras.queryParams = { bounds, heading, markers, layers, size, position, polygons };
        this.openlayers.mapMipService.navigate([state], extras).then(() => {
          this.gotoEmitterSubscriber.unsubscribe();
        });
        break;

      case MapMipService.LEAFLET_PATH:
        this.onLeaveToLeaflet().subscribe(() => {
          extras = { queryParamsHandling: 'preserve' };

          this.openlayers.mapMipService.navigate([state], extras).then(() => {
            this.gotoEmitterSubscriber.unsubscribe();
          });
        });
        break;
    }
  }


}
