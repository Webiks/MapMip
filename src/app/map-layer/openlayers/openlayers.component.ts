import {Component, OnInit, style, state, animate, transition, trigger, OnDestroy} from '@angular/core';
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

  constructor(private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private router:Router, private calcService:CalcService, private generalCanDeactivateService:GeneralCanDeactivateService) { window['current'] = this}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.generalCanDeactivateService.onLeave =  Observable.create((observer:Observer<boolean>) => this.onLeave(observer)) ;

    this.router.events.filter(event => event instanceof NavigationStart && event.url.includes("/leaflet")).take(1).subscribe(() => {this.go_north = true });
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/openlayers", false) && !this.router.isActive("/leaflet", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));

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
    if(this.queryParamsHelperService.anyTmsChanges(this.prevParams, this.currentParams) || this.noTileLayer()) {
      this.setTmsLayers(params);
    }

    //view
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if(this.anyParamChanges(params)) {
      this.setMapView(params);
    }
    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params);
    let map_changes:boolean = this.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.setMarkersChanges(params);
    }
  }

  noTileLayer():boolean {
    return _.isEmpty(this.getMapXYZLayers())
  }

  setTmsLayers(params:Params) {
    let params_tms_array:Array<string> = this.queryParamsHelperService.queryTms(params);
    let map_tms_array:Array<string> = this.getMapTmsUrls();

    if(_.isEmpty(params_tms_array) && _.isEmpty(map_tms_array) ) {
      this.addBaseLayer();
    } else {
      this.addTmsLayersViaUrl(params_tms_array);
      this.removeTmsLayersViaUrl(map_tms_array);
    }
  }

  addBaseLayer():void {

    const extent = this.transformExtent([-180.0, -90.0, 180.0, 90.0]);

    let source:ol.source.XYZ = new ol.source.XYZ(<any>{
      url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      // url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'
    });

    let layer = new ol.layer.Tile(<any>{
      source:source,
    });

    const osm_layer =  new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.OSM()
    });

    const bingLayer  = new ol.layer.Tile(<any>{
      name: "bing",
      visible: true,
      extent: extent,
      source: new ol.source.BingMaps(<any>{
        key: "Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq",
        imagerySet: "Aerial"
      })
    });
    layer.setZIndex(0);
    this.map.addLayer(layer);
  }

  addTmsLayersViaUrl(params_tms_array:Array<string>) {
    params_tms_array.forEach( (tms_url:string) => {
      if(!this.tmsUrlExistOnMap(tms_url)) {
        console.log("layer added = ", tms_url);
        let layer = new ol.layer.Tile(<olx.layer.TileOptions>{
          source: new ol.source.XYZ(<olx.source.XYZOptions> {
            url: tms_url.split("{s}").join("{a-c}")
          })
        });
        layer.setZIndex(0);
        this.map.addLayer(layer);
      }
    })
  }

  removeTmsLayersViaUrl(map_tms_array:Array<string>) {
    map_tms_array.forEach( (tms_url:string) => {
      if(!this.tmsUrlExistOnParams(tms_url)) {
        let layer = this.getMapXYZLayers().find((layer:ol.layer.Layer) => layer['jc'] == tms_url);
        console.log("layer removed = ", layer["jc"]);
        this.map.removeLayer(layer)
        if(this.noTileLayer()) this.addBaseLayer();
      }
    })
  }
  getMapXYZLayers() {
    return this.LayersArray.filter( (layer: ol.layer.Layer) => {
      if(layer instanceof ol.layer.Tile) {
        let source:ol.source.Source = layer.getSource();
        return source instanceof ol.source.XYZ
      }
    })
  }
  getMapTmsUrls():Array<string> {
    return this.getMapXYZLayers().map((layer:ol.layer.Tile) => {layer.getSource()['jc']});
  }

  tmsUrlExistOnMap(url:string):boolean {
    let urls = this.getMapTmsUrls();
    return !_.isNil(urls.find((_url:string) => _url == url));
  }

  tmsUrlExistOnParams(url:string):boolean {
    let params_tms_urls = this.queryParamsHelperService.queryTms(this.currentParams);
    return !_.isNil(params_tms_urls.find(_url => _url == url));
  }


  initializeMap():void {

    this.map = new ol.Map(<any>{
      target: 'ol',
      projection: new ol.proj.Projection(<any>{code:"EPSG:4326", extent: [-180.0000, -90.0000, 180.0000, 90.0000]}),
    });

    this.moveEndEvent = this.map.on('moveend', this.moveEnd.bind(this));
  }

  addIcon(lnglat:[number, number]){
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(lnglat, 'EPSG:4326', 'EPSG:3857')),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });
    let vectorSource = new ol.source.Vector(<any>{
      features: [iconFeature]
    });
    let iconStyle = new ol.style.Style(<any>{
      image: new ol.style.Icon(<any>{
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: '/assets/Leaflet/images/marker-icon.png'
      }),
    });
    let vectorLayer = new ol.layer.Vector(<any>{
      source: vectorSource,
      style: iconStyle
    });
    vectorLayer.setZIndex(200)
    this.map.addLayer(vectorLayer);
  }

  setMapView(params:Params):void {
    this.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
      zoom: this.queryParamsHelperService.queryZoom(params),
      rotation: this.calcService.toRadians(360 - this.queryParamsHelperService.queryHeading(params))
    }))
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

    let arrayP = [longitudeP, latitudeP, zoomP, headingP];

    let longitude:number;
    let latitude:number;
    let zoom:number;
    let heading:number;

    try{
      longitude = this.map.getView().getCenter()[0];
      latitude  = this.map.getView().getCenter()[1];
      zoom      = this.map.getView().getZoom();
      heading   = this.calcService.toDegrees(this.map.getView().getRotation());

    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom, heading];

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
    let tms = this.currentParams['tms'];

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom, heading, markers, tms});
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

  anyMarkersMapChanges(params:Params):boolean {
    let queryMarkersPositions:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<[number, number]> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<[number,number]>{
    return this.LayersArray.filter( (layer) => {
      let geom;
      if(layer.getSource && layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
      return geom instanceof ol.geom.Point;
    }) . map(layer => {
      let cord = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
      cord = ol.proj.transform(cord, 'EPSG:3857', 'EPSG:4326');
      return this.calcService.toFixes7Obj(cord);
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_positions:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<[number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_positions);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position:Array<[number, number]>) {
    params_markers_position.forEach( (marker:[number, number]) => {
      if(!this.markerExistOnMap(marker)) {
        this.addIcon(marker);
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions:Array<[number, number]>) {
    map_markers_positions.forEach((markerPos) => {
      if(!this.markerExistOnParams(markerPos)) {
        let marker_to_remove = this.LayersArray.find(
          layer => {
            let geom;
            if (layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
            if (!(geom instanceof ol.geom.Point)) return false;
            let cord = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
            cord = ol.proj.transform(cord, 'EPSG:3857', 'EPSG:4326');
            cord = this.calcService.toFixes7Obj(cord);
            return _.isEqual(cord, markerPos);
          });
        this.map.removeLayer(marker_to_remove)
      }
    })
  }

  markerExistOnMap(markerPosition:[number, number]):boolean {
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions.find((positionArray) => _.isEqual(positionArray, markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.queryParamsHelperService.queryMarkersNoHeight(this.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray , markerPosition));
    return !_.isEmpty(exist_point);
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
