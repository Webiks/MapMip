import {Component, OnInit, style, state, animate, transition, trigger, OnDestroy, ViewChild} from '@angular/core';
import * as ol from 'openlayers';
import {ActivatedRoute, Params, Router} from "@angular/router";
import 'rxjs/add/operator/take';
import {OpenlayersLayers} from "./classes/openlayers.component.layers";
import {OpenlayersMarkers} from "./classes/openlayers.component.markers";
import {OpenlayersMapView} from "./classes/openlayers.component.map-view";
import {OpenLayersMapSize} from "./classes/openlayers.component.map-size";
import {PositionFormService} from "../position-form/position-form.service";
import {OpenlayersMapPosition} from "./classes/openlayers.component.map-position";
import {OpenlayersGeoJson} from "./classes/openlayers.component.geojson";
import {QueryParamsHelperService} from "../../services/query-params-helper.service";
import {CalcService} from "../../services/calc-service";
import {animations, host} from "../../map-mip.component";
import {AjaxService} from "../../services/ajax.service";
import {MapMipService} from "../../api/map-mip.service";
import {OpenlayersPolygons} from "./classes/openlayers.component.polygons";

@Component({
  host: host,
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss'],
  animations: animations
})

export class OpenlayersComponent implements OnInit, OnDestroy{

  private _map;
  public currentParams:Params = {};
  public prevParams:Params = {};

  public layers:OpenlayersLayers;
  public markers:OpenlayersMarkers;
  public map_view:OpenlayersMapView;
  public queryParamsSubscriber;
  public map_size:OpenLayersMapSize;
  public map_position:OpenlayersMapPosition;
  public geojson:OpenlayersGeoJson;
  public polygons: OpenlayersPolygons
  public ol:any;


  @ViewChild("container") public container;

  constructor(public activatedRoute:ActivatedRoute, public queryParamsHelperService:QueryParamsHelperService, public router:Router, public calcService:CalcService, public ajaxService:AjaxService, public positionFormService:PositionFormService, public mapMipService:MapMipService) {
    window['current'] = this;
    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));

  }

  ngOnInit() {
    this.initializeMap();
  }

  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
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


  initializeMap():void {
    this.map = new ol.Map(<any>{
      target: this.container.nativeElement,
      projection: new ol.proj.Projection(<any>{code:"EPSG:4326", extent: [-180.0000, -90.0000, 180.0000, 90.0000]}),
    });
    this.ol =  ol;
    this.layers = new OpenlayersLayers(this);
    this.markers = new OpenlayersMarkers(this);
    this.map_size = new OpenLayersMapSize(this);
    this.map_position = new OpenlayersMapPosition(this);
    this.map_view = new OpenlayersMapView(this);
    this.geojson = new OpenlayersGeoJson(this);
    this.polygons = new OpenlayersPolygons(this);
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
