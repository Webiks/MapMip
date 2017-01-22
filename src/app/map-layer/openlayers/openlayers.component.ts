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
import {AjaxService} from "../ajax.service";

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

  constructor(private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private router:Router, private calcService:CalcService, private generalCanDeactivateService:GeneralCanDeactivateService, private ajaxService:AjaxService) { window['current'] = this;window['ol'] = ol}

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
    if(this.queryParamsHelperService.anyLayersChanges(this.prevParams, this.currentParams)) {
      this.setLayersChanges(params);
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
    return _.isEmpty(this.getTileLayersArray())
  }

  setLayersChanges(params:Params) {
    let params_layers_array:Array<Object> = this.queryParamsHelperService.queryLayers(params);
    let map_layers_array:Array<Object> = this.getTileLayersArray();

    this.addLayersViaUrl(params_layers_array);
    this.removeLayersViaUrl(map_layers_array);

    if(this.noTileLayer())  this.addBaseLayer();
  }

  addBaseLayer():void {
    let bing_layer = this.getBingLayer({key:'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style:'Aerial'});
    this.map.addLayer(bing_layer);
  }

  addLayersViaUrl(params_layers_array:Array<Object>) {
    let map_tile_layers = this.getTileLayersArray();
    params_layers_array.forEach( (layer_obj:{source:string}) => {
      if(!this.layerExistOnMap(map_tile_layers, layer_obj)) {
        let layer = this.getLayerFromLayerObj(layer_obj);
        this.map.addLayer(layer);
        if(layer_obj.source == 'tms') this.setTmsOptions(layer_obj['url'], layer);
      }
    });
  }

  getLayerFromLayerObj(layer_obj:{source:string}) {
    switch (layer_obj.source){
      case "mapbox":
        return this.getMapboxLayer(layer_obj);
      case "openstreetmap":
        return this.getOpenstreetmapLayer(layer_obj);
      case "bing":
        return this.getBingLayer(layer_obj);
      case "tms":
        return this.getTmsLayer(layer_obj);
      default:
        return this.getDefaultLayer(layer_obj);

    }
  }

  parseMapboxUrl(mapbox_obj):string {
    return `${mapbox_obj['url']}${mapbox_obj['mapid'] ? mapbox_obj['mapid'] + '/' : ""}{z}/{x}/{y}${mapbox_obj['format'] ? '.' + mapbox_obj['format'] : ''}?access_token=${mapbox_obj['access_token']}`
  }
  parseOpenstreetmapUrl(osm_obj) {
    return `${osm_obj['url']}/{z}/{x}/{y}${osm_obj['format'] ? '.' + osm_obj['format'] : ""}`;
  }

  parseTmsUrl(layer_obj):string {
    return `${layer_obj['url']}/{z}/{x}/{-y}${layer_obj['format'] ? '.' + layer_obj['format'] : ""}`;
  }

  setTmsOptions(url, layer) {
    this.ajaxService.getTmsmapresource(url).subscribe(
      Tmsmapresource => {
        let BoundingBox = [Tmsmapresource.TileMap.BoundingBox[0].$.minx, Tmsmapresource.TileMap.BoundingBox[0].$.miny, Tmsmapresource.TileMap.BoundingBox[0].$.maxx, Tmsmapresource.TileMap.BoundingBox[0].$.maxy];
        BoundingBox.forEach((val, index) => {BoundingBox[index] = Number(val)});
        let extent:ol.Extent = this.transformExtent(<ol.Extent>BoundingBox);
        let minZoom = parseInt(Tmsmapresource.TileMap.TileSets[0].TileSet[0].$.order);
        let maxZoom = parseInt(Tmsmapresource.TileMap.TileSets[0].TileSet[Tmsmapresource.TileMap.TileSets[0].TileSet.length - 1].$.order);
        layer.setExtent(extent);
        layer.setSource(new ol.source.XYZ(<any>{
          url: layer.getSource().jc,
          minZoom,
          maxZoom,
        }));

      });
  }

  removeLayersViaUrl(map_layers_array:Array<Object>) {
    let params_layers_urls = this.queryParamsHelperService.queryLayers(this.currentParams);

    map_layers_array.forEach( (layer:ol.layer.Tile) => {
        if(!this.layerExistOnParams(params_layers_urls, layer)){
          this.map.removeLayer(layer);
      }
    });

  }

  getTileLayersArray() {
    return this.LayersArray.filter( (layer: ol.layer.Layer) => layer instanceof ol.layer.Tile);
  }

  layerExistOnMap(map_tile_layers, layer_obj:{source:string}):boolean {
    let _layer:ol.layer.Layer  = this.getLayerFromLayerObj(layer_obj);
    let exist_on_map = map_tile_layers.find((layer) => {
      return this.layersEqual(_layer, layer);
    });
    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(params_tile_layers, _layer):boolean {
    let exist_on_params = params_tile_layers.find((layer_obj:{source:string}) => {
      let layer: ol.layer.Layer = this.getLayerFromLayerObj(layer_obj);
      return this.layersEqual(_layer, layer);
    });
    return !_.isNil(exist_on_params);
  }

  layersEqual(layer_a, layer_b):boolean {
    let source = layer_a.getSource();
    let _source = layer_b.getSource();
    let equal_source = source instanceof _source.constructor;
    let api_key = _source['c'] == source['c'];
    let url = _source['jc'] == source['jc'];
    let style = _source['o'] == source['o'];
    return equal_source && api_key && url && style
  }


  initializeMap():void {
    this.map = new ol.Map(<any>{
      target: 'ol',
      projection: new ol.proj.Projection(<any>{code:"EPSG:4326", extent: [-180.0000, -90.0000, 180.0000, 90.0000]}),
    });
    this.DragRotateInteractions = this.map.getInteractions().getArray().find( i => i instanceof ol.interaction.DragRotate);
    // this.DragRotateInteractions.setActive(false)
    this.moveEndEvent = this.map.on('moveend', this.moveEnd.bind(this));
    if(this.noTileLayer())  this.addBaseLayer();
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
    let rotate:boolean = isNaN(this.queryParamsHelperService.queryRotate(params)) ? true : false;

    this.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
      zoom: this.queryParamsHelperService.queryZoom(params),
      rotation: this.calcService.toRadians(360 - this.queryParamsHelperService.queryHeading(params))
    }));

    this.DragRotateInteractions.setActive(rotate)
  }

  getMapboxLayer(layer_obj){
    let mapbox_url:string = this.parseMapboxUrl(layer_obj);

    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: mapbox_url
      })
    });
  }

  getOpenstreetmapLayer(oms_layer){
    let osm_url:string = this.parseOpenstreetmapUrl(oms_layer);

    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: osm_url
      })
    });

  }

  getBingLayer(bing_obj):ol.layer.Tile {
    return new ol.layer.Tile(<any>{
      source: new ol.source.BingMaps(<any>{
        key: bing_obj['key'],
        imagerySet: bing_obj['style']
      })
    });
  }

  getTmsLayer(layer_obj){
    let tms_url:string = this.parseTmsUrl(layer_obj);
    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: tms_url
      })
    });
  }

  getDefaultLayer(default_obj) {
    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: `${default_obj['url']}`
      })
    });
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
