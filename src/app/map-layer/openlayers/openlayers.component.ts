import {Component, OnInit, style, state, animate, transition, trigger, OnDestroy, ViewChild} from '@angular/core';
import * as ol from 'openlayers';
import {
  ActivatedRoute, Params, Router, NavigationExtras, NavigationEnd, UrlTree, CanDeactivate,
  NavigationStart
} from "@angular/router";
import {QueryParamsHelperService} from "../query-params-helper.service";
import 'rxjs/add/operator/take';
import {host, animations} from "../map-layer.component";
import * as _ from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";
import {CalcService} from "../calc-service";
import {Observable, Observer} from "rxjs";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {AjaxService} from "../ajax.service";
import {OpenlayersLayers} from "./openlayers.component.layers";
import {OpenlayersMarkers} from "./openlayers.component.markers";
import {PositionFormService} from "../position-form/position-form.service";

@Component({
  host: host,
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss'],
  animations: animations
})

export class OpenlayersComponent implements OnInit, MapLayerChild {

  private _map;
  public moveEndEvent;
  public currentParams:Params = {};
  public prevParams:Params = {};
  public go_north:boolean = false;
  public andRotation: (boolean) => void;
  public DragRotateInteractions: ol.interaction.DragRotate;
  public layers:OpenlayersLayers;
  public markers:OpenlayersMarkers;

  constructor(private activatedRoute:ActivatedRoute, public queryParamsHelperService:QueryParamsHelperService, private router:Router, public calcService:CalcService, private generalCanDeactivateService:GeneralCanDeactivateService, public ajaxService:AjaxService, public positionFormService:PositionFormService) { window['current'] = this;window['ol'] = ol}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.generalCanDeactivateService.onLeave =  Observable.create((observer:Observer<boolean>) => this.onLeave(observer)) ;

    this.router.events.filter(event => event instanceof NavigationStart && event.url.includes("/leaflet")).take(1).subscribe(() => {this.go_north = true });
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/openlayers", false) && !this.router.isActive("/leaflet", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    this.positionFormService.markerPickerEmitter.subscribe(this.markers.toggleMarkerPicker.bind(this));
    if(this.positionFormService.onPicked) this.markers.toggleMarkerPicker(true);
  }

  onLeave(observer:Observer<boolean>):void {
    this.andRotation = (complete:boolean) => {observer.next(complete)};

    if(this.map.getView().getRotation() == 0 || !this.go_north){
      observer.next(true);
    } else {
      let radian_rotation = this.map.getView().getRotation();
      let north = this.calcService.toDegrees(radian_rotation) < 180 ? 0 : Cesium.Math.toRadians(360);
      this.map.getView().animate({rotation:north, duration:500}, this.andRotation);
    }
  };

  setQueryBoundsOnNavigationEnd(event:NavigationEnd):void {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };


  queryParams(params:Params):void {
    this.prevParams = this.currentParams;
    this.currentParams = params;

    //layers
    if(this.queryParamsHelperService.anyLayersChanges(this.prevParams, this.currentParams)) {
      this.layers.setLayersChanges(params);
    }

    //view
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if(this.anyParamChanges(params)) {
      this.setMapView(params);
    }
    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params);
    let map_changes:boolean = this.markers.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.markers.setMarkersChanges(params);
    }
  }


  initializeMap():void {
    this.map = new ol.Map(<any>{
      target: 'ol',
      projection: new ol.proj.Projection(<any>{code:"EPSG:4326", extent: [-180.0000, -90.0000, 180.0000, 90.0000]}),
    });
    this.DragRotateInteractions = this.map.getInteractions().getArray().find( i => i instanceof ol.interaction.DragRotate);
    // this.DragRotateInteractions.setActive(false)
    this.moveEndEvent = this.map.on('moveend', this.moveEnd.bind(this));
    this.layers = new OpenlayersLayers(this);
    this.markers = new OpenlayersMarkers(this);
    if(this.layers.noTileLayer())  this.layers.addBaseLayer();
  }

  setMapView(params:Params):void {
    let rotate:boolean = isNaN(this.queryParamsHelperService.queryRotate(params)) ? true : false;

    this.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
      zoom: this.queryParamsHelperService.queryZoom(params),
      rotation: this.calcService.toRadians(360 - this.queryParamsHelperService.queryHeading(params))
    }));

    this.DragRotateInteractions.setActive(rotate)
  }

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
    let heading:number = this.calcService.toRadians(360 - this.queryParamsHelperService.queryHeading(params));

    this.map.getView().fit(this.transformExtent(bounds), this.map.getSize());
    this.map.getView().setRotation(heading)
  }

  anyParamChanges(params:Params):boolean {
    let longitudeP:number = this.queryParamsHelperService.queryLng(params);
    let latitudeP:number  = this.queryParamsHelperService.queryLat(params);
    let zoomP:number      = this.queryParamsHelperService.queryZoom(params);
    let headingP:number   = 360 - this.queryParamsHelperService.queryHeading(params);
    let rotateP:number    = isNaN(this.queryParamsHelperService.queryRotate(params)) ? 1 : 0;

    let arrayP = [longitudeP, latitudeP, zoomP, headingP, rotateP];

    let longitude:number;
    let latitude:number;
    let zoom:number;
    let heading:number;
    let rotate:number;

    try{
      longitude = this.map.getView().getCenter()[0];
      latitude  = this.map.getView().getCenter()[1];
      zoom      = this.map.getView().getZoom();
      heading   = this.calcService.toDegrees(this.map.getView().getRotation());
      rotate    = this.DragRotateInteractions.getActive() ? 1 : 0;
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom, heading, rotate];

    arrayP = this.calcService.toFixes7Obj(arrayP) ;
    array = this.calcService.toFixes7Obj(array) ;

    return !_.isEqual(arrayP, array);
  }

  moveEnd(event):Promise<boolean> {
    let centerCord:ol.Coordinate = ol.proj.transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');

    let lng = centerCord[0];
    let lat = centerCord[1];
    let zoom:number = event.map.getView().getZoom();
    let heading:number = 360 - this.calcService.toDegrees(event.map.getView().getRotation());
    let markers = this.currentParams['markers'];
    let layers = this.currentParams['layers'];
    let rotate = this.currentParams['rotate'];
    rotate = rotate == 0 ? 0 : undefined;

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom, heading, markers, layers,rotate});
    return this.router.navigate([], navigationExtras);

  };

  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  }

  getBounds():[number, number, number, number] {
    let current_rotation:number = this.map.getView().getRotation();
    this.map.getView().setRotation(0);
    let bounds:ol.Extent = this.map.getView().calculateExtent(this.map.getSize());
    this.map.getView().setRotation(current_rotation);
    let t_bounds:ol.Extent = ol.proj.transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');
    let saved_bounds:[number, number, number, number] = t_bounds;
    return saved_bounds;
  }


  get LayersArray() {
    return this.map.getLayers().getArray();
  }

  get map() {
    return this._map;
  }

  set map(value) {
    this._map = value;
  }

}
