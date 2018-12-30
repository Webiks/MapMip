import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/take';
import { CesiumLayers } from './classes/cesium.component.layers';
import { CesiumMarkers } from './classes/cesium.component.markers';
import { PositionFormService } from '../../position-form/position-form.service';
import { CesiumMapView } from './classes/cesium.component.map-view';
import { CesiumMapSize } from './classes/cesium.component.map-size';
import { CesiumMapPosition } from './classes/cesium.component.map-position';
import { CesiumTerrian } from './classes/cesium.component.terrain';
import { CesiumMapLighting } from './classes/cesium.component.map-lighting';
import { CesiumGeoJson } from './classes/cesium.component.geojson';
import { animations } from '../../map-mip.component';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { MapMipService } from '../../api/map-mip.service';
import { CesiumPolygons } from './classes/cesium.component.polygons';
import { CesiumPolyline } from './classes/cesium.component.polyline';

@Component({
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations: animations
})

export class CesiumComponent implements OnInit, OnDestroy {
  @HostBinding('@routeAnimation')
  get routeAnimation() {
    return true;
  }

  @ViewChild('container') public container: ElementRef;

  public viewer: any;
  public prevParams: Params = {};
  public currentParams: Params = {};
  public queryParamsSubscriber;

  public layers: CesiumLayers;
  public markers: CesiumMarkers;
  public map_view: CesiumMapView;
  public map_size: CesiumMapSize;
  public map_position: CesiumMapPosition;
  public terrain: CesiumTerrian;
  public map_lighting: CesiumMapLighting;
  private geojson: CesiumGeoJson;
  private polygon: CesiumPolygons;
  private polyline: CesiumPolyline;

  constructor(public queryParamsHelperService: QueryParamsHelperService, public activatedRoute: ActivatedRoute, public router: Router, public calcService: CalcService, public positionFormService: PositionFormService, public mapMipService: MapMipService) {
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
    this.map_size = new CesiumMapSize(this);
    this.map_view = new CesiumMapView(this);
    this.map_position = new CesiumMapPosition(this);
    this.terrain = new CesiumTerrian(this);
    this.map_lighting = new CesiumMapLighting(this);
    this.geojson = new CesiumGeoJson(this);
    this.polygon = new CesiumPolygons(this, this.queryParamsHelperService);
    this.polyline = new CesiumPolyline(this, this.queryParamsHelperService);
  };

  queryParams(params: Params): void {
    this.prevParams = this.currentParams;
    this.currentParams = params;
  };

  initializeMap(): void {
    Cesium.buildModuleUrl.setBaseUrl('assets/Cesium/');
    Cesium.BingMapsApi.defaultKey = 'AnjT_wAj_juA_MsD8NhcEAVSjCYpV-e50lUypkWm1JPxVu0XyVqabsvD3r2DQpX-';

    this.viewer = new Cesium.Viewer(this.container.nativeElement, {
      baseLayerPicker: false,
      imageryProvider: CesiumLayers.baseLayer()
    });
  }


}
