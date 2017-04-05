import {LeafletComponent} from "../leaflet.component";
import {Params, NavigationExtras, UrlTree, NavigationEnd} from "@angular/router";
import * as _ from "lodash";
import {MapMipService} from "../../../api/map-mip.service";
import {EventEmitter} from "@angular/core";

export class LeafletMapView{
  public queryParamsSubscriber;
  public navigationEndSubscriber;

  constructor(private leaflet:LeafletComponent){
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.navigationEndSubscriber = leaflet.router.events.filter(event => event instanceof NavigationEnd && event.url.includes("/cesium")).take(1).subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    leaflet.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    leaflet.map.on('moveend', this.moveEnd.bind(this));
  }

  queryParams(params:Params){
    if(this.leaflet.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else{
      if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }
  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.navigationEndSubscriber.unsubscribe();
  }


  moveEnd(event):Promise<boolean> {
    if(!this.anyParamChanges(this.leaflet.currentParams)) return;
    let lng: number  = event.target.getCenter().lng;
    let lat: number  = event.target.getCenter().lat;
    let zoom:number  = event.target.getZoom();
    let markers      = this.leaflet.currentParams['markers'];
    let layers       = this.leaflet.currentParams['layers'];
    let size       = this.leaflet.currentParams['size'];
    let position = this.leaflet.currentParams['position'];
    let geojson = this.leaflet.currentParams['geojson'];


    let navigationExtras:NavigationExtras = this.leaflet.queryParamsHelperService.getQuery({lng, lat, zoom, markers, layers, size,position,geojson});

    return this.leaflet.mapMipService.navigate([], navigationExtras)
  };


  setMapView(params:Params):void {
    let longitude:number = this.leaflet.queryParamsHelperService.queryLng(params);
    let latitude:number = this.leaflet.queryParamsHelperService.queryLat(params);
    let zoom:number = this.leaflet.queryParamsHelperService.queryZoom(params);

    this.leaflet.map.setView([latitude, longitude], zoom);
  }

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.leaflet.queryParamsHelperService.queryBounds(params);
    this.leaflet.map.fitBounds(<L.LatLngBoundsExpression> [[bounds[1], bounds[0]], [ bounds[3], bounds[2]] ], null);
  }

  anyParamChanges(params:Params):boolean {
    let longitudeP:number = this.leaflet.queryParamsHelperService.queryLng(params);
    let latitudeP:number  = this.leaflet.queryParamsHelperService.queryLat(params);
    let zoomP:number      = this.leaflet.queryParamsHelperService.queryZoom(params);

    let arrayP = [longitudeP, latitudeP, zoomP];

    let longitude:number;
    let latitude:number;
    let zoom:number;

    try{
      longitude = this.leaflet.map.getCenter().lng;
      latitude  = this.leaflet.map.getCenter().lat;
      zoom      = this.leaflet.map.getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP = this.leaflet.calcService.toFixes7Obj(arrayP);
    array = this.leaflet.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array);
  }

  getBounds():[number, number, number, number] {
    let leaflet_bounds:L.LatLngBounds = this.leaflet.map.getBounds();
    let saved_bounds:[number, number, number, number] = [leaflet_bounds.getSouthWest().lng, leaflet_bounds.getSouthWest().lat, leaflet_bounds.getNorthEast().lng, leaflet_bounds.getNorthEast().lat];
    return saved_bounds;
  }

  setQueryBoundsOnNavigationEnd(event):void {
    let urlTree:UrlTree = this.leaflet.router.parseUrl(event);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.leaflet.mapMipService.navigateByUrl(urlTree.toString());
  }
}
