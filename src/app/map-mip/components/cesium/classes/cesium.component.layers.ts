import { CesiumComponent } from '../cesium.component';
import { Params } from '@angular/router';
import * as _ from 'lodash';

export class CesiumLayers {
  public queryParamsSubscriber;

  static getBingLayer(layer_obj) {
    return new Cesium.BingMapsImageryProvider({
      url: layer_obj['url'],
      key: layer_obj['key'],
      mapStyle: layer_obj['style']
    });
  }

  static baseLayer() {
    return this.getBingLayer({
      url: 'https://dev.virtualearth.net',
      key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq',
      style: 'AerialWithLabels'
    });
  }

  parseMapBoxUrl(layer_obj, url: string): string {
    if (_.isEmpty(layer_obj.format)) {
      url = url.replace('.png', '');
    }
    if (_.isEmpty(layer_obj.mapid)) {
      url = url.replace('undefined/', '');
    }
    return url;
  }

  getMapboxLayer(layer_obj) {
    return new Cesium.MapboxImageryProvider({
      url: layer_obj['url'],
      mapId: layer_obj['mapid'],
      accessToken: layer_obj['access_token'],
      format: layer_obj['format'] ? layer_obj['format'] : undefined,
      proxy: {
        getURL: (url: string) => this.parseMapBoxUrl(layer_obj, url)
      }
    });
  }


  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anyLayersChanges(this.cesium.prevParams, this.cesium.currentParams) || this.noTileLayer()) {
      this.setLayersChanges(params);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  getLayerFromLayerObj(layer_obj: { source: string }) {
    switch (layer_obj.source) {
      case 'mapbox':
        return this.getMapboxLayer(layer_obj);
      case 'openstreetmap':
        return this.getOpenstreetmapLayer(layer_obj);
      case 'bing':
        return CesiumLayers.getBingLayer(layer_obj);
      case 'tms':
        return this.getTmsLayer(layer_obj);
      default:
        return this.getUrlTemplateLayer(layer_obj);
    }
  }

  getTmsLayer(layer_obj) {
    return new Cesium.createTileMapServiceImageryProvider({
      url: layer_obj['url'],
      fileExtension: layer_obj['format']
    });
  }

  getOpenstreetmapLayer(layer_obj) {
    return new Cesium.createOpenStreetMapImageryProvider({
      url: layer_obj['url'],
      format: layer_obj['format'],
      proxy: {
        getURL: (url: string) => this.parseMapBoxUrl(layer_obj, url)
      }
    });
  }

  getUrlTemplateLayer(default_obj) {
    return new Cesium.UrlTemplateImageryProvider({
      url: this.cesium.queryParamsHelperService.layerObjectToUrl(default_obj)
    });
  }

  setLayersChanges(params: Params) {
    let params_tms_array = this.cesium.queryParamsHelperService.queryLayers(params);
    let imageryLayers = this.cesium.viewer.imageryLayers._layers;

    this.removeLayersViaUrl(imageryLayers);
    this.addLayersViaUrl(params_tms_array);

    if (this.noTileLayer()) {
      this.addBaseLayer();
    }

  }

  addLayersViaUrl(params_layers_array: Array<Object>) {
    params_layers_array.forEach((layer_obj: { source: string }, index: number) => {
      let _imageryProvider = this.getLayerFromLayerObj(layer_obj);
      if (!this.layerExistOnMap(_imageryProvider, index)) {
        this.cesium.viewer.imageryLayers.addImageryProvider(_imageryProvider, index);
      }

    });
  }

  removeLayersViaUrl(map_imageryLayers) {
    let layers_to_remove = map_imageryLayers.filter(imageryLayer => !this.layerExistOnParams(imageryLayer));
    layers_to_remove.forEach(imageryLayer => {
      this.cesium.viewer.imageryLayers.remove(imageryLayer);
    });
  }

  noTileLayer(): boolean {
    return _.isEmpty(this.cesium.viewer.imageryLayers._layers);
  }

  layerExistOnMap(_imageryProvider, index): boolean {
    let map_imagery_layers = this.cesium.viewer.imageryLayers._layers;

    let exist_on_map = map_imagery_layers.find(imageryLayer => {
      return this.imageryProvidersEqual(imageryLayer, _imageryProvider, index);
    });

    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(imageryLayer): boolean {

    let params_layers = this.cesium.queryParamsHelperService.queryLayers(this.cesium.currentParams);

    let exist_on_params = params_layers.find((layer_obj: { source: string }, index: number) => {
      let _imageryProvider = this.getLayerFromLayerObj(layer_obj);
      return this.imageryProvidersEqual(imageryLayer, _imageryProvider, index);
    });

    return !_.isNil(exist_on_params);
  }


  imageryProvidersEqual(imageryLayer, _imageryProvider, index): boolean {
    let imageryProvider = imageryLayer.imageryProvider;
    return imageryProvider instanceof _imageryProvider.constructor
      && index === imageryLayer._layerIndex
      && imageryProvider['_url'] === _imageryProvider['_url']
      && imageryProvider['_accessToken'] === _imageryProvider['_accessToken'] // MapboxImageryProvider
      && imageryProvider['_mapId'] === _imageryProvider['_mapId'] // MapboxImageryProvider
      && imageryProvider['_mapStyle'] === _imageryProvider['_mapStyle'] // BingImageryProvider
      && imageryProvider['_key'] === _imageryProvider['_key']; // BingImageryProvider
  }


  addBaseLayer(): void {
    const baseLayer = CesiumLayers.baseLayer();
    this.cesium.viewer.imageryLayers.addImageryProvider(baseLayer);
  }

}
