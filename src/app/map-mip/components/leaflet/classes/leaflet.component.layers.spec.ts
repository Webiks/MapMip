import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { LeafletComponent } from '../leaflet.component';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from '../../../position-form/position-form.service';
import { Params, Router } from '@angular/router';
import { CalcService } from '../../../services/calc-service';
import { LeafletLayers } from './leaflet.component.layers';
import * as _ from 'lodash';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as L from 'leaflet';

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let router: Router;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpModule
      ],
      declarations: [LeafletComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));


  beforeEach(inject([QueryParamsHelperService, Router, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _router: Router, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    router = _router;
    positionFormService = _positionFormService;
    fixture.detectChanges();
  }));


  describe('layers', () => {
    let layers: LeafletLayers;

    beforeEach(() => {
      layers = component.layers;
    });

    it('queryParams: setLayersChanges should to have been call if: noTileLayerRes is "true" or anyTmsChanges is "true"', () => {
      let anyLayersChangesRes = false;
      let noTileLayerRes = false;
      spyOn(layers, 'noTileLayer').and.callFake(() => noTileLayerRes);
      spyOn(queryParamsHelperService, 'anyLayersChanges').and.callFake(() => anyLayersChangesRes);
      spyOn(layers, 'setLayersChanges');

      let params: Params = {};
      layers.queryParams(params);
      expect(layers.setLayersChanges).not.toHaveBeenCalled();
      anyLayersChangesRes = true;
      layers.queryParams(params);
      expect(layers.setLayersChanges).toHaveBeenCalledWith(params);
    });

    it('addBaseLayer should get bing layer and add layer to viewer imageryProviders', () => {
      let fake_layer = {
        addTo: (): void => {
        }
      };
      spyOn(layers, 'getBingLayer').and.callFake(() => fake_layer);
      spyOn(fake_layer, 'addTo');
      layers.addBaseLayer();
      expect(layers.getBingLayer).toHaveBeenCalled();
      expect(fake_layer.addTo).toHaveBeenCalled();
    });

    it('destroy', () => {
      spyOn(layers.queryParamsSubscriber, 'unsubscribe');
      layers.destroy();
      expect(layers.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('getBingLayer should return BingImageryProvider with mapStyle key and url', () => {
      let bing_obj = { key: 'fake_key', style: 'fake_style' };
      spyOn(<any>L.tileLayer, 'bing');
      layers.getBingLayer(bing_obj);
      expect(L.tileLayer['bing']).toHaveBeenCalledWith({
        bingMapsKey: bing_obj['key'],
        imagerySet: bing_obj['style']
      });
    });
    it('should getLayerFromLayerObj call the right get Layer functions via layer_obj.source', () => {
      let layer_obj: { source: string } = <any>{};
      spyOn(layers, 'getMapboxLayer');
      spyOn(layers, 'getOpenstreetmapLayer');
      spyOn(layers, 'getBingLayer');
      spyOn(layers, 'getTmsLayer');
      spyOn(layers, 'getDefaultLayer');
      layer_obj.source = 'mapbox';
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getMapboxLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = 'bing';
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getBingLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = 'openstreetmap';
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getOpenstreetmapLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = 'tms';
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getTmsLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = 'default';
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getDefaultLayer).toHaveBeenCalledWith(layer_obj);
    });


    it('setLayersChanges: should call addTmsLayersViaUrl and removeTmsLayersViaUrl and addBaseLayer if no tile layers in map', () => {
      let params: Params = {};
      let fake_parmas_layers_array: Array<Object> = [1, 2, 3];
      let fake_map_layers_array: Array<Object> = [4, 5, 6];
      let noTileLayerRes = false;

      spyOn(queryParamsHelperService, 'queryLayers').and.callFake(() => fake_parmas_layers_array);
      spyOn(layers, 'getTileLayersArray').and.callFake(() => fake_map_layers_array);

      spyOn(layers, 'addLayersViaUrl');
      spyOn(layers, 'removeLayersViaUrl');
      spyOn(layers, 'sortLayers');

      spyOn(layers, 'addBaseLayer');
      spyOn(layers, 'noTileLayer').and.callFake(() => noTileLayerRes);

      layers.setLayersChanges(params);
      expect(layers.addLayersViaUrl).toHaveBeenCalledWith(fake_parmas_layers_array);
      expect(layers.removeLayersViaUrl).toHaveBeenCalledWith(fake_map_layers_array);
      expect(layers.sortLayers).toHaveBeenCalledWith(fake_parmas_layers_array);
      expect(layers.addBaseLayer).not.toHaveBeenCalled();
      noTileLayerRes = true;
      layers.setLayersChanges(params);
      expect(layers.addBaseLayer).toHaveBeenCalled();
    });

    it('addLayersViaUrl should add layers that exists on params but not exists on map', () => {
      let layer_a = { url: 'layer_a_url', source: 'mapbox' };
      let layer_b = {
        url: 'layer_b_url', source: 'bing', addTo: () => {
        }
      };
      let params_layers = [layer_a, layer_b];

      spyOn(layers, 'layerExistOnMap').and.callFake((layer) => _.isEqual(layer, layer_a)); // layer_b return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_b);
      spyOn(layer_b, 'addTo');

      layers.addLayersViaUrl(params_layers);
      expect(layer_b.addTo).toHaveBeenCalledWith(component.map);
    });

    it('removeLayersViaUrl should remove layers that exists on map but not exists on params', () => {
      let layer_a = { url: 'layer_a_url' };
      let layer_b = { url: 'layer_b_url' };
      let map_layers = [layer_a, layer_b];

      spyOn(layers, 'layerExistOnParams').and.callFake(([], layer) => _.isEqual(layer, layer_b)); // layer_a return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_a);
      spyOn(component.map, 'removeLayer');

      layers.removeLayersViaUrl(map_layers);

      expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
      expect(component.map.removeLayer).toHaveBeenCalledWith(layer_a);
    });
    it('sortLayers should loop on params and set correct zIndex to each layer', () => {
      let fake_layer = {
        setZIndex(zIndex) {
        }
      };
      let layers_array = [3, 2, 1];
      layers_array.find = (): any => fake_layer;
      spyOn(fake_layer, 'setZIndex');
      spyOn(layers, 'getTileLayersArray').and.callFake(() => layers_array);
      spyOn(layers, 'layersEqual').and.callFake((a, b) => a === b);
      let fake_parmas_layers_array: Array<Object> = [1, 2, 3];
      layers.sortLayers(fake_parmas_layers_array);
      expect(fake_layer.setZIndex).toHaveBeenCalledTimes(3);
    });
    it('noTileLayer should return true if getTileLayersArray array is empty', () => {
      let getTileLayersArrayRes = [1, 2, 3];
      spyOn(layers, 'getTileLayersArray').and.callFake(() => getTileLayersArrayRes);
      expect(layers.noTileLayer()).toBeFalsy();
      getTileLayersArrayRes = [];
      expect(layers.noTileLayer()).toBeTruthy();
    });

    it('parseMapBoxUrl should check if format or mapid are empty and remove them from url', () => {
      let layer_obj = { url: 'mapbox_url', access_token: 'Hiyush' }; // empty format empty mapid
      expect(layers.parseMapboxUrl(layer_obj)).toEqual(`mapbox_url{z}/{x}/{y}?access_token=Hiyush`);
    });

    it('layersEqual should compere 2 imageryProviders and return if they are equals', () => {
      let layer = <any>{ _url: 'a', options: { zIndex: 2 } };
      let _layer = <any>{ _url: 'b', options: { zIndex: 0 } };

      let layer_obj = { source: 'mapbox' };
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => _layer);
      expect(layers.layersEqual(layer, layer_obj)).toBeFalsy();
      _layer._url = 'a';
      expect(layers.layersEqual(layer, layer_obj)).toBeTruthy();
    });

    it('layerExistOnMap should get layer_obj and return  return if exist of map', () => {
      let layer_obj_a = { source: 'default', url: 'fake_url_a' };
      let layer_obj_b = { source: 'openstreetmap', url: 'fake_url_b' };
      let layer_obj_c = { source: 'mapbox', url: 'fake_url_c' };

      let map_tile_layers = [
        layers.getLayerFromLayerObj(layer_obj_a),
        layers.getLayerFromLayerObj(layer_obj_b)
      ];

      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_a)).toBeTruthy();
      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_b)).toBeTruthy();
      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_c)).toBeFalsy();

    });

    it('layerExistOnParams should get imageryProvider and return if exist of params', () => {
      let layer_obj_a = { source: 'default', url: 'fake_url_a' };
      let layer_obj_b = { source: 'openstreetmap', url: 'fake_url_b' };
      let layer_obj_c = { source: 'mapbox', url: 'fake_url_c' };

      let params_layer_array = [layer_obj_a, layer_obj_b];
      let layer_to_check: L.TileLayer = layers.getLayerFromLayerObj(layer_obj_a);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_b);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_c);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeFalsy();
    });

    it('getLayersArray should return all layers in Array', () => {
      let layars = [];
      component.map.eachLayer((lay) => {
        layars.push(lay);
      });
      expect(layers.getLayersArray()).toEqual(layars);
    });


  });

});
