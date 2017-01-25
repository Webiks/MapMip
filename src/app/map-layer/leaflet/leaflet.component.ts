import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationExtras, NavigationEnd, UrlTree} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {host, animations} from "../map-layer.component";
import {MapLayerChild} from "../map-layer-child.interface";
import * as _ from 'lodash'
import * as L from 'leaflet';
import "leaflet-bing-layer/leaflet-bing-layer";
import {CalcService} from "../calc-service";
import {AjaxService} from "../ajax.service";
import {LeafletLayers} from "./leaflet.component.layers";
import {LeafletMarkers} from "./leaflet.component.markers";
import {PositionFormService} from "../position-form/position-form.service";

@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})

export class LeafletComponent implements OnInit, MapLayerChild {

  private _map;
  public currentParams:Params = {};
  public prevParams:Params = {};
  public layers:LeafletLayers;
  public markers:LeafletMarkers;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, public queryParamsHelperService:QueryParamsHelperService, public calcService:CalcService, public ajaxService:AjaxService, public positionFormService:PositionFormService) {window['current'] = this;}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/leaflet", false) && !this.router.isActive("/openlayers", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    this.positionFormService.markerPickerEmitter.subscribe(this.markers.toggleMarkerPicker.bind(this.markers));
    if(this.positionFormService.onPicked) this.markers.toggleMarkerPicker.bind(this.markers)(true);
  }

  setQueryBoundsOnNavigationEnd(event:NavigationEnd):void {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  }

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
    } else{
      if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }

    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, this.currentParams);
    let map_changes:boolean = this.markers.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.markers.setMarkersChanges(params);
    }

  }

  initializeMap():void {
    this.map = L.map('leafletContainer');
    this.map.on('moveend', this.moveEnd.bind(this));
    this.layers = new LeafletLayers(this);
    this.markers = new LeafletMarkers(this);
    if(this.layers.noTileLayer())  this.layers.addBaseLayer();
  }

  moveEnd(event):Promise<boolean> {
    if(!this.anyParamChanges(this.currentParams)) return;
    let lng: number  = event.target.getCenter().lng;
    let lat: number  = event.target.getCenter().lat;
    let zoom:number  = event.target.getZoom();
    let markers      = this.currentParams['markers'];
    let layers          = this.currentParams['layers'];

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom, markers, layers});

    return this.router.navigate([], navigationExtras);
  };


  setMapView(params:Params):void {
    let longitude:number = this.queryParamsHelperService.queryLng(params);
    let latitude:number = this.queryParamsHelperService.queryLat(params);
    let zoom:number = this.queryParamsHelperService.queryZoom(params);

    this.map.setView([latitude, longitude], zoom);
  }

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
    this.map.fitBounds(<L.LatLngBoundsExpression> [[bounds[1], bounds[0]], [ bounds[3], bounds[2]] ], null);
  }

  anyParamChanges(params:Params):boolean {
    let longitudeP:number = this.queryParamsHelperService.queryLng(params);
    let latitudeP:number  = this.queryParamsHelperService.queryLat(params);
    let zoomP:number      = this.queryParamsHelperService.queryZoom(params);

    let arrayP = [longitudeP, latitudeP, zoomP];

    let longitude:number;
    let latitude:number;
    let zoom:number;

    try{
      longitude = this.map.getCenter().lng;
      latitude  = this.map.getCenter().lat;
      zoom      = this.map.getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP = this.calcService.toFixes7Obj(arrayP);
    array = this.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array);
  }

  getBounds():[number, number, number, number] {
    let leaflet_bounds:L.LatLngBounds = this.map.getBounds();
    let saved_bounds:[number, number, number, number] = [leaflet_bounds.getSouthWest().lng, leaflet_bounds.getSouthWest().lat, leaflet_bounds.getNorthEast().lng, leaflet_bounds.getNorthEast().lat];
    return saved_bounds;
  }

  get map():L.Map {
    return this._map;
  }

  set map(value:L.Map) {
    this._map = value;
  }




}

