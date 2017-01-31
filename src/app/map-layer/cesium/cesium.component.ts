import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {
  ActivatedRoute, Params, Router
} from "@angular/router";
import {host, animations} from "../map-layer.component";
import 'rxjs/add/operator/take';
import "cesium/Build/Cesium/Cesium.js";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";
import {CesiumLayers} from "./classes/cesium.component.layers";
import {CesiumMarkers} from "./classes/cesium.component.markers";
import {PositionFormService} from "../position-form/position-form.service";
import {CesiumMapView} from "./classes/cesium.component.map-view";

@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit,OnDestroy  {

  @ViewChild('container') public container:ElementRef;

  public viewer:any;
  public prevParams:Params = {};
  public currentParams:Params = {};
  public queryParamsSubscriber;

  public layers:CesiumLayers;
  public markers:CesiumMarkers;
  public map_view:CesiumMapView;

  constructor(public queryParamsHelperService:QueryParamsHelperService, public activatedRoute:ActivatedRoute, public generalCanDeactivateService:GeneralCanDeactivateService, public router:Router, public calcService:CalcService, public positionFormService:PositionFormService) {
    this.queryParamsSubscriber = activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    window['current'] = this;
  }

  ngOnDestroy(): void {
    this.queryParamsSubscriber.unsubscribe();
    this.map_view.destroy();
    this.layers.destroy();
    this.markers.destroy();
  }

  ngOnInit() {
    this.initializeMap();
    this.markers = new CesiumMarkers(this);
    this.layers = new CesiumLayers(this);
    this.map_view = new CesiumMapView(this);
  };

  queryParams(params:Params):void {
    this.prevParams = this.currentParams;
    this.currentParams = params;
  };

  initializeMap():void {
    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = "AnjT_wAj_juA_MsD8NhcEAVSjCYpV-e50lUypkWm1JPxVu0XyVqabsvD3r2DQpX-";
    this.viewer = new Cesium.Viewer(this.container.nativeElement , {
      baseLayerPicker : false
    });
  }



}
