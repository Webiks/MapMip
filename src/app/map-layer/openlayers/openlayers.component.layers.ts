import {Params} from "@angular/router";
import {OpenlayersComponent} from "./openlayers.component";
import * as _ from 'lodash';

export class OpenlayersLayers {

  constructor(private openlayers:OpenlayersComponent){}

  noTileLayer():boolean {
    return _.isEmpty(this.getTileLayersArray())
  }

  setLayersChanges(params:Params) {
    let params_layers_array:Array<Object> = this.openlayers.queryParamsHelperService.queryLayers(params);
    let map_layers_array:Array<Object> = this.getTileLayersArray();

    this.addLayersViaUrl(params_layers_array);
    this.removeLayersViaUrl(map_layers_array);

    if(this.noTileLayer())  this.addBaseLayer();
  }

  addBaseLayer():void {
    let bing_layer = this.getBingLayer({key:'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style:'Aerial'});
    this.openlayers.map.addLayer(bing_layer);
  }

  addLayersViaUrl(params_layers_array:Array<Object>) {
    let map_tile_layers = this.getTileLayersArray();
    params_layers_array.forEach( (layer_obj:{source:string}) => {
      if(!this.layerExistOnMap(map_tile_layers, layer_obj)) {
        let layer = this.getLayerFromLayerObj(layer_obj);
        this.openlayers.map.addLayer(layer);
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
    this.openlayers.ajaxService.getTmsmapresource(url).subscribe(
      Tmsmapresource => {
        let BoundingBox = [Tmsmapresource.TileMap.BoundingBox[0].$.minx, Tmsmapresource.TileMap.BoundingBox[0].$.miny, Tmsmapresource.TileMap.BoundingBox[0].$.maxx, Tmsmapresource.TileMap.BoundingBox[0].$.maxy];
        BoundingBox.forEach((val, index) => {BoundingBox[index] = Number(val)});
        let extent:ol.Extent = this.openlayers.transformExtent(<ol.Extent>BoundingBox);
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
    let params_layers_urls = this.openlayers.queryParamsHelperService.queryLayers(this.openlayers.currentParams);

    map_layers_array.forEach( (layer:ol.layer.Tile) => {
      if(!this.layerExistOnParams(params_layers_urls, layer)){
        this.openlayers.map.removeLayer(layer);
      }
    });

  }

  getTileLayersArray() {
    return this.openlayers.LayersArray.filter( (layer: ol.layer.Layer) => layer instanceof ol.layer.Tile);
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
        url: `${this.openlayers.calcService.getParsedUrlWithSubdomain(default_obj['url'])}`
      })
    });
  }

}
