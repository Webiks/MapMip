import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationExtras, NavigationEnd, UrlTree} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {host, animations} from "../map-layer.component";
import {MapLayerChild} from "../map-layer-child.interface";
import * as _ from 'lodash'
import * as L from 'leaflet';
import "leaflet-bing-layer/leaflet-bing-layer";
import {CalcService} from "../calc-service";
import {AjaxService} from "../ajax.service";
import {Observable} from "rxjs";

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


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private calcService:CalcService, private ajaxService:AjaxService) {window['current'] = this;}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/leaflet", false) && !this.router.isActive("/openlayers", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
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
    if(this.queryParamsHelperService.anyLayersChanges(this.prevParams, this.currentParams) || this.noTileLayer()) {
      this.setLayersChanges(params);
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
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params);
    let map_changes:boolean = this.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.setMarkersChanges(params);
    }

  }

  initializeMap():void {
    this.map = L.map('leafletContainer');
    this.map.on('moveend', this.moveEnd);
  }

  moveEnd: (event) => Promise<boolean> = (event):Promise<boolean> => {
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

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersPositions:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<[number, number]> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition():Array<[number, number]> {
    return <Array<[number, number]>> this.getMarkerLayersArray().map((layer:L.Marker) => {
      let latlng = layer.getLatLng();
      return [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<[number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position:Array<[number, number]>) {
    params_markers_position.forEach( marker => {
      if(!this.markerExistOnMap(marker)) {
        this.getBaseMarker(marker).addTo(this.map);
      }
    });
  }

  getBaseMarker(marker:[number, number]){
    let icon = L.icon(<L.IconOptions>{
      iconUrl: '/assets/Leaflet/images/marker-icon.png',
      shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
    });
    return L.marker([marker[1],marker[0]], {icon:icon});

  }

  removeMarkersViaUrl(map_markers_positions:Array<[number, number]>) {
    map_markers_positions.forEach((markerPos) => {
      if(!this.markerExistOnParams(markerPos)) {
        let marker_to_remove = this.getMarkerLayersArray().find(
          (layer:L.Marker) => {
            let currentM = [layer.getLatLng().lng, layer.getLatLng().lat];
            return _.isEqual(currentM, markerPos);
          });
        this.map.removeLayer(marker_to_remove)
      }
    })
  }

  getMarkerLayersArray():Array<L.Marker>{
    let m_layers = [];
    this.map.eachLayer((l:L.Marker) => {
      if(l.getLatLng) m_layers.push(l);
    });
    return m_layers;
  }

  markerExistOnMap(markerPosition) {
    let markers_map_positions:Array<[number, number]> = this.getMarkersPosition();
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.queryParamsHelperService.queryMarkersNoHeight(this.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  get map():L.Map {
    return this._map;
  }

  set map(value:L.Map) {
    this._map = value;
  }


  noTileLayer():boolean {
    return _.isEmpty(this.getTileLayersArray());
  }


  setLayersChanges(params:Params) {
    let params_tms_array:Array<Object> = this.queryParamsHelperService.queryLayers(params);
    let map_tile_layers_array:Array<Object> = this.getTileLayersArray();

    if(_.isEmpty(params_tms_array) && _.isEmpty(map_tile_layers_array)) {
      this.addBaseLayer();
    } else {
      this.addLayersViaUrl(params_tms_array);
      this.removeLayersViaUrl(map_tile_layers_array);
    }
  }
  addBaseLayer():void {
    this.getBingLayer({key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style:'Aerial'}).addTo(this.map);
  }

  addLayersViaUrl(params_layers_array:Array<Object>) {
    let map_tile_layers = this.getTileLayersArray();
    params_layers_array.forEach( (layer_obj:{source:string}) => {
      if(!this.layerExistOnMap(map_tile_layers, layer_obj)) {
        let layer = this.getLayerFromLayerObj(layer_obj);

        if(layer_obj.source == 'tms'){
          this.setTmsOptions(layer_obj['url'], layer);
        } else {
          layer.addTo(this.map)
        }
      }
    })
  }

  getLayerFromLayerObj(layer_obj:{source:string}):L.TileLayer {
    switch (layer_obj.source){
      case "mapbox":
        let mapbox_url:string = this.parseMapboxUrl(layer_obj);
        return L.tileLayer(mapbox_url);
      case "bing":
        return this.getBingLayer(layer_obj);
      case "tms":
        return this.getTmsLayer(layer_obj);
      default :
        return L.tileLayer(`${layer_obj['url']}/{z}/{x}/{y}.png`);
    }
  }

  removeLayersViaUrl(map_tile_layers_array:Array<Object>) {
    let params_layers_urls = this.queryParamsHelperService.queryLayers(this.currentParams);

    map_tile_layers_array.forEach( (layer:L.TileLayer) => {
      if(!this.layerExistOnParams(params_layers_urls, layer)){
        this.map.removeLayer(layer);
      }
    });

    if(this.noTileLayer())  this.addBaseLayer();

  }

  getTileLayersArray():Array<Object> {
    return this.getLayersArray().filter((layer:L.TileLayer) => !_.isNil(layer.getTileSize));
  }

  layerExistOnMap(map_tile_layers, layer_obj):boolean {
    let _layer: L.TileLayer  = this.getLayerFromLayerObj(layer_obj);

    let exist_on_map = map_tile_layers.find((layer) => {
      return _.isEqual(_layer['_url'], layer['_url']) && _.isEqual(_layer['options'], layer['options']);
    });
    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(params_tile_layers, layer):boolean {
    let exist_on_params = params_tile_layers.find((layer_obj:{source:string}) => {
      let _layer: L.TileLayer  = this.getLayerFromLayerObj(layer_obj);
      return _.isEqual(_layer['_url'], layer['_url']) && _.isEqual(_layer['options'], layer['options']);
    });
    return !_.isNil(exist_on_params);
  }

  getLayersArray():Array<L.Layer> {
    let layers = [];
    this.map.eachLayer((l) => layers.push(l));
    return layers;
  }


  parseMapboxUrl(mapbox_obj):string {
    return `${mapbox_obj['url']}${mapbox_obj['mapid']}/{z}/{x}/{y}${mapbox_obj['format'] ? '.' + mapbox_obj['format'] : ''}?access_token=${mapbox_obj['access_token']}`
  }

  getBingLayer(bing_obj):L.TileLayer {
    return L.tileLayer['bing']({bingMapsKey: bing_obj['key'], imagerySet:bing_obj['style']});
  }

  getTmsLayer(tms_obj) {
    let tms_layer = L.tileLayer(`${tms_obj['url']}/{z}/{x}/{y}.png`, {tms:true});
    return tms_layer;
  }

  setTmsOptions(url, tms_layer) {
    this.ajaxService.getTmsmapresource(url).subscribe(
      Tmsmapresource => {
        let bounds = L.latLngBounds(L.latLng(Tmsmapresource['TileMap'].BoundingBox[0].$.miny, Tmsmapresource['TileMap'].BoundingBox[0].$.minx), L.latLng(Tmsmapresource['TileMap'].BoundingBox[0].$.maxy, Tmsmapresource['TileMap'].BoundingBox[0].$.maxx));
        let minZoom = Tmsmapresource.TileMap.TileSets[0].TileSet[0].$.order;
        let maxZoom = Tmsmapresource.TileMap.TileSets[0].TileSet[Tmsmapresource.TileMap.TileSets[0].TileSet.length - 1].$.order;
        tms_layer.options.bounds = bounds;
        tms_layer.options.maxZoom = maxZoom;
        tms_layer.options.minZoom = minZoom;
        tms_layer.addTo(this.map);
      });
  }
}

