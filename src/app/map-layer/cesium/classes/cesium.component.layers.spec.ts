
import {CesiumComponent} from "../cesium.component";
import {TestBed, inject, async, ComponentFixture} from "@angular/core/testing";
import {PositionFormService} from "../../position-form/position-form.service";
import {CalcService} from "../../calc-service";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {Router, Params} from "@angular/router";
import {GeneralCanDeactivateService} from "../../general-can-deactivate.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CesiumLayers} from "./cesium.component.layers";
import * as _ from "lodash";

describe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let router: Router;
  let queryParamsHelperService: QueryParamsHelperService;
  let calcService: CalcService;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CesiumComponent],
      providers: [QueryParamsHelperService, GeneralCanDeactivateService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router, QueryParamsHelperService, CalcService, PositionFormService], (_router: Router, _queryParamsHelperService: QueryParamsHelperService, _calcService: CalcService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
    positionFormService = _positionFormService;
  }));

  describe("layers", () => {
    let layers:CesiumLayers;

    beforeEach(()=>{
      layers = component.layers;
    });

    it('queryParams: setLayersChanges should to have been call if: noTileLayerRes is "true" or anyLayersChanges is "true"', ()=>{
      let anyLayersChangesRes:boolean = false;
      let noTileLayerRes:boolean = false;
      spyOn(layers,'noTileLayer').and.callFake(() => noTileLayerRes)
      spyOn(queryParamsHelperService, 'anyLayersChanges').and.callFake(() => anyLayersChangesRes);
      spyOn(layers, 'setLayersChanges');

      let params:Params = {};
      layers.queryParams(params);
      expect(layers.setLayersChanges).not.toHaveBeenCalled();
      anyLayersChangesRes = true;
      layers.queryParams(params);
      expect(layers.setLayersChanges).toHaveBeenCalledWith(params);
    });

    it("destroy", ()=> {
      spyOn(layers.queryParamsSubscriber, 'unsubscribe');
      layers.destroy();
      expect(layers.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('addBaseLayer should get bing layer and add layer to viewer imageryProviders', ()=> {
      let fake_base_layer = {name:'bing_base_layer'};
      spyOn(layers, 'getBingLayer').and.callFake(() => fake_base_layer);
      spyOn(component.viewer.imageryLayers, 'addImageryProvider');
      layers.addBaseLayer();
      expect(component.viewer.imageryLayers.addImageryProvider).toHaveBeenCalledWith(fake_base_layer)
    });
    it('getBingLayer should return BingImageryProvider with mapStyle key and url', ()=>{
      let layer_obj = {url:'fake_url', style:'fake_style', key:'fake_key'};
      let bing_layer = layers.getBingLayer(layer_obj);
      expect(bing_layer instanceof Cesium.BingMapsImageryProvider).toBeTruthy();
    });
    it('should getLayerFromLayerObj call the right get Layer functions via layer_obj.source', () => {
      let layer_obj:{source:string} = <any>{};
      spyOn(layers, 'getMapboxLayer');
      spyOn(layers, 'getOpenstreetmapLayer');
      spyOn(layers, 'getBingLayer');
      spyOn(layers, 'getTmsLayer');
      spyOn(layers, 'getUrlTemplateLayer');
      layer_obj.source = "mapbox";
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getMapboxLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = "bing";
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getBingLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = "openstreetmap";
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getOpenstreetmapLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = "tms";
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getTmsLayer).toHaveBeenCalledWith(layer_obj);
      layer_obj.source = "default";
      layers.getLayerFromLayerObj(layer_obj);
      expect(layers.getUrlTemplateLayer).toHaveBeenCalledWith(layer_obj);
    });


    it('setLayersChanges: should call addTmsLayersViaUrl and removeTmsLayersViaUrl and addBaseLayer if no tile layers in map', () => {
      let params:Params = {};
      let fake_parmas_layers_array:Array<Object> = [1,2,3];
      let fake_map_layers_array:Array<Object> = [4,5,6];
      let noTileLayerRes:boolean = false;

      spyOn(queryParamsHelperService, 'queryLayers').and.callFake(() => fake_parmas_layers_array);
      component.viewer.imageryLayers._layers = fake_map_layers_array;
      spyOn(layers, 'addLayersViaUrl');
      spyOn(layers, 'removeLayersViaUrl');
      spyOn(layers, 'addBaseLayer');
      spyOn(layers, 'noTileLayer').and.callFake(() => noTileLayerRes);

      layers.setLayersChanges(params);
      expect(layers.addLayersViaUrl).toHaveBeenCalledWith(fake_parmas_layers_array);
      expect(layers.removeLayersViaUrl).toHaveBeenCalledWith(fake_map_layers_array);
      expect(layers.addBaseLayer).not.toHaveBeenCalled();
      noTileLayerRes = true;
      layers.setLayersChanges(params);
      expect(layers.addBaseLayer).toHaveBeenCalled();
    });

    it('addLayersViaUrl should add layers that exists on params but not exists on map', ()=>{
      let layer_a = {url:'layer_a_url', source:'mapbox'};
      let layer_b = {url:'layer_b_url', source:'bing'};
      let params_layers = [layer_a,layer_b];

      spyOn(layers, 'layerExistOnMap').and.callFake((layer) => _.isEqual(layer, layer_a)); // layer_b return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_b);
      spyOn(component.viewer.imageryLayers, 'addImageryProvider');

      layers.addLayersViaUrl(params_layers);

      expect(component.viewer.imageryLayers.addImageryProvider).toHaveBeenCalledTimes(1);
      expect(component.viewer.imageryLayers.addImageryProvider).toHaveBeenCalledWith(layer_b);
    });

    it('removeLayersViaUrl should remove layers that exists on map but not exists on params', ()=>{
      let layer_a = {imageryProvider: {url:'layer_a_url'}};
      let layer_b = {imageryProvider: {url:'layer_b_url'}};
      let map_layers = [layer_a, layer_b];

      spyOn(layers, 'layerExistOnParams').and.callFake( imageryProvider => _.isEqual(imageryProvider, layer_a.imageryProvider) ); // layer_a return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_a);
      spyOn(component.viewer.imageryLayers, 'remove');

      layers.removeLayersViaUrl(map_layers);

      expect(component.viewer.imageryLayers.remove).toHaveBeenCalledTimes(1);
      expect(component.viewer.imageryLayers.remove).toHaveBeenCalledWith(layer_b);
    });

    it('no tile layer should return true if _layers array is empty', ()=>{
      component.viewer.imageryLayers._layers = [1,2,3];
      expect(layers.noTileLayer()).toBeFalsy();
      component.viewer.imageryLayers._layers = [];
      expect(layers.noTileLayer()).toBeTruthy();
    });

    it('parseMapBoxUrl should check if format or mapid are empty and remove them from url', ()=>{
      let layer_obj = {source:'mapbox', url:'mapbox_url'}; //empty format empty mapid
      let mapbox_url = 'mapbox_url/undefined/{z}/{x}/{y}.png'; //'undefined/'(miss mapid) and '.png'(default format) ;
      let fix_url = layers.parseMapBoxUrl(layer_obj, mapbox_url);
      expect(fix_url).toEqual("mapbox_url/{z}/{x}/{y}")
    });

    it('imageryProvidersEqual should compere 2 imageryProviders and return if they are equals', () => {
      let imagery_a = {_url: 'a'};
      let imagery_b = {_url: 'b'};
      expect(layers.imageryProvidersEqual(imagery_a, imagery_b)).toBeFalsy();
      imagery_b._url = "a";
      expect(layers.imageryProvidersEqual(imagery_a, imagery_b)).toBeTruthy();
    });


    it('layerExistOnMap should get layer_obj and return  return if exist of map' , ()=>{
      let layer_obj_a = {source:'default', url:'fake_url_a'};
      let layer_obj_b = {source:'openstreetmap', url:'fake_url_b'};
      let layer_obj_c = {source:'mapbox', url:'fake_url_c'};
      let map_imagery_providers = [layers.getLayerFromLayerObj(layer_obj_a), layers.getLayerFromLayerObj(layer_obj_b)];
      spyOn(component.viewer.imageryLayers._layers, 'map').and.callFake(() => map_imagery_providers);
      expect(layers.layerExistOnMap(layer_obj_a)).toBeTruthy();
      expect(layers.layerExistOnMap(layer_obj_b)).toBeTruthy();
      expect(layers.layerExistOnMap(layer_obj_c)).toBeFalsy();

    });

    it('layerExistOnParams should get imageryProvider and return if exist of params' , ()=>{
      let layer_obj = {source:'default', url:'fake_url'};
      let imageryProvider = layers.getLayerFromLayerObj(layer_obj);
      let params_layers_obj = [layer_obj];
      spyOn(queryParamsHelperService, 'queryLayers').and.callFake(() => params_layers_obj);
      expect(layers.layerExistOnParams(imageryProvider)).toBeTruthy();
      layer_obj.url = 'fake_other_url';
      expect(layers.layerExistOnParams(imageryProvider)).toBeFalsy();
    })

  })




});

