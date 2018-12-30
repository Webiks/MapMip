import { Params } from '@angular/router';
import { OpenlayersComponent } from '../openlayers.component';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

declare const Cesium;

export class OpenlayersLayers {
  public queryParamsSubscriber;

  constructor(private openlayers: OpenlayersComponent) {
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    if (this.noTileLayer()) {
      this.addBaseLayer();
    }
  }


  queryParams(params: Params): void {
    if (this.openlayers.queryParamsHelperService.anyLayersChanges(this.openlayers.prevParams, this.openlayers.currentParams)) {
      this.setLayersChanges(params);
    }

  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  noTileLayer(): boolean {
    return _.isEmpty(this.getTileLayersArray());
  }

  setLayersChanges(params: Params) {
    let params_layers_array: Array<Object> = this.openlayers.queryParamsHelperService.queryLayers(params);
    let map_layers_array: Array<Object> = this.getTileLayersArray();

    this.addLayersViaUrl(params_layers_array);
    this.removeLayersViaUrl(map_layers_array);
    this.sortLayers(params_layers_array);

    if (this.noTileLayer()) {
      this.addBaseLayer();
    }

  }

  sortLayers(params_layers_array) {
    // let layersGroup = this.openlayers.map.getLayers();
    // let layersArray = layersGroup.a;
    params_layers_array.forEach((layer_obj: any, index: number) => {
      let layer = this.getLayerFromLayerObj(layer_obj);
      let map_l = this.getTileLayersArray().find((_layer: any) => this.layersEqual(layer, _layer));
      //  let map_l = layersArray.find(_layer => this.layersEqual(layer, _layer.a.layer ));
      if (map_l) {
        map_l.setZIndex(index);
      }


    });
  }

  addBaseLayer(): void {
    let bingLayer = this.getBingLayer({
      key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq',
      style: 'AerialWithLabels'
    });
    this.openlayers.map.addLayer(bingLayer);
  }

  addLayersViaUrl(params_layers_array: Array<Object>) {
    let map_tile_layers = this.getTileLayersArray();
    params_layers_array.forEach(
      async (layer_obj: { source: string }, index: number) => {
        if (!this.layerExistOnMap(map_tile_layers, layer_obj)) {
          let layer = this.getLayerFromLayerObj(layer_obj);
          if (layer_obj.source === 'tms') {
            await this.setTmsOptions(layer_obj['url'], layer);
          }
          layer.setZIndex(index);
          this.openlayers.map.addLayer(layer);
          // this.openlayers.map.getLayers().a[index].setZIndex(index);
        }
      });
  }

  getLayerFromLayerObj(layer_obj: { source: string }) {
    switch (layer_obj.source) {
      case 'mapbox':
        return this.getMapboxLayer(layer_obj);
      case 'openstreetmap':
        return this.getOpenstreetmapLayer(layer_obj);
      case 'bing':
        return this.getBingLayer(layer_obj);
      case 'tms':
        return this.getTmsLayer(layer_obj);
      default:
        return this.getDefaultLayer(layer_obj);

    }
  }

  parseMapboxUrl(mapbox_obj): string {
    return `${mapbox_obj['url']}${mapbox_obj['mapid'] ? mapbox_obj['mapid'] + '/' : ''}{z}/{x}/{y}${mapbox_obj['format'] ? '.' + mapbox_obj['format'] : ''}?access_token=${mapbox_obj['access_token']}`;
  }

  parseOpenstreetmapUrl(osm_obj) {
    return `${osm_obj['url']}/{z}/{x}/{y}${osm_obj['format'] ? '.' + osm_obj['format'] : ''}`;
  }

  parseTmsUrl(layer_obj): string {
    return `${layer_obj['url']}/{z}/{x}/{-y}${layer_obj['format'] ? '.' + layer_obj['format'] : ''}`;
  }

  setTmsOptions(url, layer) {
    return new Promise(res => {
      let cesium_tms_layer = Cesium.createTileMapServiceImageryProvider({ url });
      cesium_tms_layer.readyPromise.then((response) => {
        let bounds = _.map(cesium_tms_layer.rectangle, (a) => Cesium.Math.toDegrees(a));
        let minZoom = cesium_tms_layer.minimumLevel;
        let maxZoom = cesium_tms_layer.maximumLevel;
        let extent: ol.Extent = this.openlayers.transformExtent(<ol.Extent>bounds);
        layer.setExtent(extent);
        layer.setSource(new ol.source.XYZ(<any>{
          url: layer.getSource().jc,
          minZoom,
          maxZoom
        }));
        res(response);
      });
    });
  }

  removeLayersViaUrl(map_tile_layers_array: Array<Object>) {
    let params_layers_urls = this.openlayers.queryParamsHelperService.queryLayers(this.openlayers.currentParams);
    let layers_to_remove = map_tile_layers_array.filter((layer: ol.layer.Tile) => (!this.layerExistOnParams(params_layers_urls, layer)));
    layers_to_remove.forEach((layer: ol.layer.Tile) => {
      this.openlayers.map.removeLayer(layer);
    });
  }

  getTileLayersArray() {
    return this.openlayers.LayersArray.filter((layer: ol.layer.Layer) => layer instanceof ol.layer.Tile);
  }

  layerExistOnMap(map_tile_layers, layer_obj: { source: string }): boolean {
    let _layer: ol.layer.Layer = this.getLayerFromLayerObj(layer_obj);
    let exist_on_map = map_tile_layers.find((layer) => {
      return this.layersEqual(_layer, layer);
    });
    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(params_tile_layers, _layer): boolean {
    let exist_on_params = params_tile_layers.find((layer_obj: { source: string }) => {
      let layer: ol.layer.Layer = this.getLayerFromLayerObj(layer_obj);
      return this.layersEqual(_layer, layer);
    });
    return !_.isNil(exist_on_params);
  }

  layersEqual(layer_a: ol.layer.Layer, layer_b: ol.layer.Layer): boolean {
    let source = layer_a.getSource();
    let _source = layer_b.getSource();
    let equal_source = source instanceof _source.constructor;
    let api_key = _source['c'] === source['c'];
    let url = _source['jc'] === source['jc'];
    let style = _source['o'] === source['o'];

    return equal_source && api_key && url && style;
  }

  getOpenstreetmapLayer(oms_layer) {
    let osm_url: string = this.parseOpenstreetmapUrl(oms_layer);

    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: osm_url
      }),
      extent: ol.proj.transformExtent([-180.0000, -90.0000, 180.0000, 90.0000], 'EPSG:4326', 'EPSG:3857')
    });

  }

  getMapboxLayer(layer_obj) {
    let mapbox_url: string = this.parseMapboxUrl(layer_obj);

    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: mapbox_url
      }),
      extent: ol.proj.transformExtent([-180.0000, -90.0000, 180.0000, 90.0000], 'EPSG:4326', 'EPSG:3857')
    });
  }

  getBingLayer(bing_obj): ol.layer.Tile {
    return new ol.layer.Tile(<any>{
      source: new ol.source.BingMaps(<any>{
        key: bing_obj['key'],
        imagerySet: bing_obj['style']
      }),
      extent: ol.proj.transformExtent([-180.0000, -90.0000, 180.0000, 90.0000], 'EPSG:4326', 'EPSG:3857')
    });
  }

  getTmsLayer(layer_obj) {
    let tms_url: string = this.parseTmsUrl(layer_obj);
    let layer = new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: tms_url
      }),
      extent: ol.proj.transformExtent([-180.0000, -90.0000, 180.0000, 90.0000], 'EPSG:4326', 'EPSG:3857')
    });
    return layer;
  }

  getDefaultLayer(default_obj) {
    return new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.XYZ(<olx.source.XYZOptions> {
        url: `${this.openlayers.calcService.getParsedUrlWithSubdomain(default_obj['url'])}`
      }),
      extent: ol.proj.transformExtent([-180.0000, -90.0000, 180.0000, 90.0000], 'EPSG:4326', 'EPSG:3857')
    });
  }

}
