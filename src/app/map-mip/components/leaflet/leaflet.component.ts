import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationEnd} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import * as L from 'leaflet';
//import * as L.Draw 'leaflet-draw';
import "leaflet-bing-layer/leaflet-bing-layer";
import "leaflet-ajax/dist/leaflet.ajax";
import {LeafletLayers} from "./classes/leaflet.component.layers";
import {LeafletMarkers} from "./classes/leaflet.component.markers";
import {PositionFormService} from "../position-form/position-form.service";
import {LeafletMapView} from "./classes/leaflet.component.map-view";
import {LeafletMapSize} from "./classes/leaflet.component.map-size";
import {LeafletMapPosition} from "./classes/leaflet.component.map-position";
import {LeafletGeoJson} from "./classes/leaflet.component.geojson";
import {QueryParamsHelperService} from "../../services/query-params-helper.service";
import {CalcService} from "../../services/calc-service";
import {AjaxService} from "../../services/ajax.service";
import {animations, host} from "../../map-mip.component";
import {MapMipService} from "../../api/map-mip.service";
import {LeafletPolygons} from "./classes/leaflet.component.polygons";


@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})

export class LeafletComponent implements OnInit, OnDestroy{

  private _map;
  public queryParamsSubscriber;
  public currentParams:Params = {};
  public prevParams:Params = {};
  public layers:LeafletLayers;
  public markers:LeafletMarkers;
  public map_view:LeafletMapView;
  public map_size:LeafletMapSize;
  public map_position:LeafletMapPosition;
  public geojson:LeafletGeoJson;
  public polygons:LeafletPolygons;

  @ViewChild("container") public container;
  public L: any;


  constructor(public router:Router, public activatedRoute:ActivatedRoute, public queryParamsHelperService:QueryParamsHelperService, public calcService:CalcService, public ajaxService:AjaxService, public positionFormService:PositionFormService, public mapMipService:MapMipService) {
    window['current'] = this;
    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));

  }

  ngOnInit() {
    this.initializeMap();
    this.layers = new LeafletLayers(this);
    this.markers = new LeafletMarkers(this);
    this.map_size = new LeafletMapSize(this);
    this.map_view = new LeafletMapView(this);
    this.map_position = new LeafletMapPosition(this);
    this.geojson = new LeafletGeoJson(this);
    this.polygons = new LeafletPolygons(this,this.queryParamsHelperService);

  }

  initializeMap():void {
    this.map = L.map(this.container.nativeElement);
    this.L = L;
  }

  ngOnDestroy(): void {
    this.queryParamsSubscriber.unsubscribe();
    this.map_view.destroy();
    this.layers.destroy();
    this.markers.destroy();
  }

  queryParams(params:Params):void {
    this.prevParams = this.currentParams;
    this.currentParams = params;
  }



  get map():L.Map {
    return this._map;
  }

  set map(value:L.Map) {
    this._map = value;
  }




}

