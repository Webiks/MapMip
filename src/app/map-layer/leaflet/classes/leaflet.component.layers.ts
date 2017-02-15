import {LeafletComponent} from "../leaflet.component";
import {Params} from "@angular/router";
import * as _ from 'lodash'

export class LeafletLayers {
  public queryParamsSubscriber;

  constructor(private leaflet:LeafletComponent){
    if(this.noTileLayer())  this.addBaseLayer();
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params){
    if(this.leaflet.queryParamsHelperService.anyLayersChanges(this.leaflet.prevParams, this.leaflet.currentParams)) {
      this.setLayersChanges(params);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  setLayersChanges(params:Params) {
    let params_tms_array:Array<Object> = this.leaflet.queryParamsHelperService.queryLayers(params);
    let map_tile_layers_array:Array<Object> = this.getTileLayersArray();

    this.addLayersViaUrl(params_tms_array);
    this.removeLayersViaUrl(map_tile_layers_array);

    if(this.noTileLayer())  this.addBaseLayer();
  }

  addBaseLayer():void {
    this.getBingLayer({key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style:'Aerial'}).addTo(this.leaflet.map);
  }

  addLayersViaUrl(params_layers_array:Array<Object>) {
    let map_tile_layers = this.getTileLayersArray();
    params_layers_array.forEach(
      async (layer_obj:{source:string}) => {
        if(!this.layerExistOnMap(map_tile_layers, layer_obj)) {
          let layer:L.TileLayer = this.getLayerFromLayerObj(layer_obj);
          if(layer_obj.source == 'tms'){
            await this.setTmsOptions(layer_obj['url'], layer);
          }
          layer.addTo(this.leaflet.map)

        }
      })
  }

  getLayerFromLayerObj(layer_obj:{source:string}):L.TileLayer {
    switch (layer_obj.source){
      case "mapbox":
        return this.getMapboxLayer(layer_obj);
      case "openstreetmap":
        return this.getOpenstreetmapLayer(layer_obj);
      case "bing":
        return this.getBingLayer(layer_obj);
      case "tms":
        return this.getTmsLayer(layer_obj);
      default :
        return this.getDefaultLayer(layer_obj);
    }
  }

  getMapboxLayer(mapbox_obj){
    let mapbox_url:string = this.parseMapboxUrl(mapbox_obj);
    return L.tileLayer(mapbox_url);
  }

  removeLayersViaUrl(map_tile_layers_array:Array<Object>) {
    let params_layers_urls = this.leaflet.queryParamsHelperService.queryLayers(this.leaflet.currentParams);

    map_tile_layers_array.forEach( (layer:L.TileLayer) => {
      if(!this.layerExistOnParams(params_layers_urls, layer)){
        this.leaflet.map.removeLayer(layer);
      }
    });
  }

  getTileLayersArray():Array<Object> {
    return this.getLayersArray().filter((layer:L.TileLayer) => !_.isNil(layer.getTileSize));
  }

  layerExistOnMap(map_tile_layers, layer_obj):boolean {
    let _layer: L.TileLayer  = this.getLayerFromLayerObj(layer_obj);

    let exist_on_map = map_tile_layers.find((layer:L.TileLayer) => {
      return this.layersEqual(layer, _layer);
    });
    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(params_tile_layers, layer:L.TileLayer):boolean {
    let exist_on_params = params_tile_layers.find((layer_obj:{source:string}) => {
      let _layer: L.TileLayer  = this.getLayerFromLayerObj(layer_obj);
      return this.layersEqual(layer, _layer);
    });
    return !_.isNil(exist_on_params);
  }

  layersEqual(layer, _layer):boolean {
    return _.isEqual(_layer['_url'], layer['_url']) && _.isEqual(_layer['options'], layer['options']);
  }

  getLayersArray():Array<L.Layer> {
    let layers = [];
    this.leaflet.map.eachLayer((l) => layers.push(l));
    return layers;
  }


  parseMapboxUrl(mapbox_obj):string {
    return `${mapbox_obj['url']}${mapbox_obj['mapid'] ? mapbox_obj['mapid'] + '/' : ""}{z}/{x}/{y}${mapbox_obj['format'] ? '.' + mapbox_obj['format'] : ''}?access_token=${mapbox_obj['access_token']}`
  }
  getOpenstreetmapLayer(osm_obj){
    let osm_url = this.parseOpenstreetmapUrl(osm_obj);
    return L.tileLayer(osm_url);
  }
  getBingLayer(bing_obj):L.TileLayer {
    return L.tileLayer['bing']({bingMapsKey: bing_obj['key'], imagerySet:bing_obj['style']});
  }
  getTmsLayer(tms_obj) {
    let tms_url = this.parseTmsUrl(tms_obj);
    return L.tileLayer(tms_url, {tms:true});
  }
  getDefaultLayer(default_obj) {
    return L.tileLayer(this.leaflet.queryParamsHelperService.layerObjecttToUrl(default_obj));
  }
  parseTmsUrl(osm_obj){
    return `${osm_obj['url']}/{z}/{x}/{y}${osm_obj['format'] ? '.' + osm_obj['format'] : ''}`
  }
  parseOpenstreetmapUrl(osm_obj){
    return `${osm_obj['url']}/{z}/{x}/{y}${osm_obj['format'] ? '.' + osm_obj['format'] : ''}`
  }

  setTmsOptions(url, layer):Promise<any>{
    return new Promise(res => {
      let cesium_tms_layer =  Cesium.createTileMapServiceImageryProvider({url});
      cesium_tms_layer.readyPromise.then((response)=>{
        let bounds = _.map(cesium_tms_layer.rectangle, (a) => Cesium.Math.toDegrees(a));
        layer['options'].bounds = L.latLngBounds(L.latLng(bounds[1],bounds[0]), L.latLng(bounds[3],bounds[2]));
        layer['options'].maxZoom = cesium_tms_layer.maximumLevel;
        layer['options'].minZoom = cesium_tms_layer.minimumLevel;
        res(response);
      })
    });
  }


  noTileLayer():boolean {
    return _.isEmpty(this.getTileLayersArray());
  }


}