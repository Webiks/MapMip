/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { LeafletComponent } from './leaflet.component';
import {RouterTestingModule} from "@angular/router/testing";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc-service";
import {Params, Router, NavigationExtras} from "@angular/router";
import {LeafletLayers} from "./leaflet.component.layers";
import {AjaxService} from "../ajax.service";
import {HttpModule} from "@angular/http";
import {LeafletMarkers} from "./leaflet.component.markers";
import {PositionFormService} from "../position-form/position-form.service";

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService:QueryParamsHelperService;
  let router:Router;
  let icon_layer = L.icon(<L.IconOptions>{
    iconUrl: '/assets/Leaflet/images/marker-icon.png',
    shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpModule
      ],
      declarations: [ LeafletComponent ],
      providers: [QueryParamsHelperService, CalcService, AjaxService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService, Router],(_queryParamsHelperService:QueryParamsHelperService, _router:Router) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    router = _router;
    fixture.detectChanges();
  }));

  it('should component be defined', () => {
    expect(component).toBeDefined();
  });

  describe('queryParams: ',() => {
    it('should save currentParmas with the newParmas and prevParams with currentParams', ()=>{
      let currentParams:Params = {
        yaya: 'tata'
      };
      let newParams:Params = {
        tata: 'yaya'
      };
      component.currentParams = currentParams;
      component.queryParams(newParams);
      expect(component.prevParams).toEqual(currentParams);
      expect(component.currentParams).toEqual(newParams);
    });

    it('setLayersChanges should to have been call if: noTileLayerRes is "true" or anyTmsChanges is "true"', ()=>{
      let anyLayersChangesRes:boolean = false;
      let noTileLayerRes:boolean = false;
      spyOn(component.layers,'noTileLayer').and.callFake(() => noTileLayerRes);
      spyOn(queryParamsHelperService, 'anyLayersChanges').and.callFake(() => anyLayersChangesRes);
      spyOn(component.layers, 'setLayersChanges');

      let params:Params = {};
      component.queryParams(params);
      expect(component.layers.setLayersChanges).not.toHaveBeenCalled();
      anyLayersChangesRes = true;
      component.queryParams(params);
      expect(component.layers.setLayersChanges).toHaveBeenCalledWith(params);
    });

    it('params with "bounds" should make setMapBounds to have been call', () => {
      spyOn(component, 'setMapBounds');
      let params:Params = {
        lat:'1.123',
        lng:'4.567',
        bounds: '1,2,3,4'
      };
      component.queryParams(params);
      expect(component.setMapBounds).toHaveBeenCalledWith(params);
    });

    it('params with no "bounds" should make setMapView to have been call, only when anyParamChanges return "true"', () => {
      let anyParamsChangesReturnValue:boolean = false;
      spyOn(component, 'setMapView');
      spyOn(component, 'anyParamChanges').and.callFake(() => anyParamsChangesReturnValue);

      let params:Params = {
        lat:'1.123',
        lng:'4.567'
      };
      component.queryParams(params);
      expect(component.setMapView).not.toHaveBeenCalledWith(params);
      anyParamsChangesReturnValue = true;
      component.queryParams(params);
      expect(component.setMapView).toHaveBeenCalledWith(params);
    });

    it('setMarkersChanges: should have been call only when both params_changes and map_changes are "true" ', () => {
      let params_changes:boolean = true;
      let map_changes:boolean = true;

      spyOn(component.markers, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(component.markers, 'setMarkersChanges');

      let params:Params = {
        lat:'1.123',
        lng:'4.567',
        zoom: '5',
        markers: '(1,2,3),(4,5,6)'
      };

      params_changes = true;
      map_changes = false;
      component.queryParams(params);
      expect(component.markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = false;
      map_changes = true;
      component.queryParams(params);
      expect(component.markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = true;
      map_changes = true;
      component.queryParams(params);
      expect(component.markers.setMarkersChanges).toHaveBeenCalledWith(params);

    })
  });

  it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams and should call router.navigate only when anyParamChanges=true', () => {
    let anyParamChangesRes:boolean = false;
    spyOn(router, 'navigate');
    spyOn(component, 'anyParamChanges').and.callFake(() => anyParamChangesRes);

    component.currentParams = {markers: '(1,2,3)'};

    let event = {
      target: {
        getCenter: () => {
          return {
            lat: 1,
            lng: 2
          }
        },
        getZoom: () => 10
      }
    };

    component.moveEnd(event);
    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, markers: '(1,2,3)', layers:undefined});
    expect(router.navigate).not.toHaveBeenCalledWith([], navigationExtras);

    anyParamChangesRes = true;
    component.moveEnd(event);
    expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);
  });

  it('setMapView should get params and use them to call map.setView with params values',()=>{
    spyOn(component.map, 'setView');
    let params:Params = {
      lng: 1,
      lat: 2,
      zoom :10
    };
    component.setMapView(params);
    expect(component.map.setView).toHaveBeenCalledWith([2,1], 10);
  });

  it('setMapBounds should get params and use them to call map.fitBounds' , () => {
    spyOn(component.map, 'fitBounds');

    let params:Params = {
      bounds :'1,2,3,4'
    };

    component.setMapBounds(params);
    expect(component.map.fitBounds).toHaveBeenCalledWith([[2,1],[4,3]], null);
  });

  it("anyParamChanges should get params and check if there's any changes between params and map" , () => {
    let getCenter = () => {return {lng: 1.11111111111, lat:2.2222222222}};
    let getZoom = () => 10;
    let params:Params = {
      lng: 1.11111111111111111111111111,
      lat: 2.22222222222222222222222222,
      zoom :10
    };
    spyOn(component.map, 'getCenter').and.callFake(getCenter);
    spyOn(component.map, 'getZoom').and.callFake(getZoom);
    expect(component.anyParamChanges(params)).toBeFalsy();
    params['zoom'] = 12;
    expect(component.anyParamChanges(params)).toBeTruthy();
  });

  it("getBounds should get bounds(L.LatLngBounds) from map and return the bounds as [number,number,number,number]" , () => {
    let latlngBounds: L.LatLngBounds = L.latLngBounds([[1,2], [3,4]])
    spyOn(component.map, 'getBounds').and.returnValue(latlngBounds);
    let boundsRes: [number, number, number, number] = component.getBounds();
    expect(boundsRes).toEqual([2,1,4,3])
  });




  describe("markers", () => {
    let markers:LeafletMarkers;

    beforeEach(()=>{
      markers = component.markers;
    });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
      let params_markers = [1,2,3];
      let map_markers = [1,2,3,4]
      spyOn(markers, 'getMarkersPosition').and.callFake(()=>params_markers);
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(()=>map_markers);
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();
      params_markers = [1,2,3,4,5];
      map_markers    = [1,2,3,4,5];
      expect(markers.anyMarkersMapChanges({})).toBeFalsy();
    });

    it('getMarkersPosition should return positions array ( [lng, lat], [lng, lat],...)', ()=>{
      L.marker([20,30], {icon:icon_layer}).addTo(component.map);
      L.marker([40,50], {icon:icon_layer}).addTo(component.map);
      expect(markers.getMarkersPosition().length).toEqual(2);
      expect(markers.getMarkersPosition()[0]).toEqual([30,20]);
      expect(markers.getMarkersPosition()[1]).toEqual([50,40]);
    });

    it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', ()=>{
      let params_markers_position:Array<[number, number]> = [[1,2], [4,5]];
      let map_markers_positions:Array<[number, number]> = [[6,7], [8,9]];

      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers_position);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers_positions);

      spyOn(markers, 'addMarkersViaUrl');
      spyOn(markers, 'removeMarkersViaUrl');
      markers.setMarkersChanges({});
      expect(markers.addMarkersViaUrl).toHaveBeenCalledWith(params_markers_position);
      expect(markers.removeMarkersViaUrl).toHaveBeenCalledWith(map_markers_positions);
    });

    it('addMarkersViaUrl: should get positions array from params. for each position create marker if not exists on map', ()=>{
      let params_markers_position:Array<[number, number]> = [[1,2], [3,4]];
      markers.addMarkersViaUrl(params_markers_position);
      let position_of_map_markers = markers.getMarkersPosition();
      expect(position_of_map_markers).toEqual(params_markers_position);
    });

    it('removeMarkersViaUrl: addMarkersViaUrl: should get positions array from map. for each position remvoe marker if not exists on params', ()=>{
      L.marker([2,1], {icon:icon_layer}).addTo(component.map);
      let marker_to_remove = L.marker([4,3], {icon:icon_layer});
      marker_to_remove.addTo(component.map);

      let position_of_map_markers = markers.getMarkersPosition(); // [[1,2],[3,4]]
      expect(markers.getMarkersPosition()).toEqual([[1,2],[3,4]]);

      component.currentParams = {markers: '(1,2)'}; // (3,4) should be removed
      markers.removeMarkersViaUrl(position_of_map_markers);

      expect(markers.getMarkersPosition()).toEqual([[1,2]]);
    });

    it('markerExistOnMap: should get one position and return if there is marker on map with that position', ()=>{
      L.marker([2,1], {icon:icon_layer}).addTo(component.map);
      expect(markers.markerExistOnMap([1,2])).toBeTruthy();
      expect(markers.markerExistOnMap([3,4])).toBeFalsy();
    });

    it('markerExistOnParams: should get one position and return if there is marker on params with that position', ()=>{
      component.currentParams = {
        markers: '(1,2),(3,4)'
      };
      expect(markers.markerExistOnParams([1,2])).toBeTruthy();
      expect(markers.markerExistOnParams([3,4])).toBeTruthy();
      expect(markers.markerExistOnParams([5,6])).toBeFalsy();
    });


    it("toggleMarkerPicker should get checked variable and invoke different functions accordingly", ()=>{
      spyOn(component.map,'on');
      spyOn(component.map,'off');

      markers.toggleMarkerPicker(true);
      expect(component.map.on).toHaveBeenCalled();
      markers.toggleMarkerPicker(false);
      expect(component.map.off).toHaveBeenCalledWith('click');
    });

    it("leftClickInputAction should get event with latlng, and call addMarker with latlng", () => {
      spyOn(queryParamsHelperService,'addMarker');
      let event:{latlng: L.LatLng} = {latlng: new L.latLng(30,30)};
      markers.leftClickInputAction(event);
      expect(queryParamsHelperService.addMarker).toHaveBeenCalledWith([30,30]);
    })




  });

  describe("layers", () => {
    let layers:LeafletLayers;

    beforeEach(()=>{
      layers = component.layers;
    });

    it('addBaseLayer should get bing layer and add layer to viewer imageryProviders', ()=> {
      let fake_layer = {addTo:():void => {}};
      spyOn(layers, "getBingLayer").and.callFake(() => fake_layer);
      spyOn(fake_layer, 'addTo');
      layers.addBaseLayer();
      expect(layers.getBingLayer).toHaveBeenCalled();
      expect(fake_layer.addTo).toHaveBeenCalled();
    });
    it('getBingLayer should return BingImageryProvider with mapStyle key and url', ()=>{
      let bing_obj = {key:'fake_key', style:'fake_style'};
      spyOn(L.tileLayer, 'bing');
      layers.getBingLayer(bing_obj);
      expect(L.tileLayer['bing']).toHaveBeenCalledWith({bingMapsKey:bing_obj['key'], imagerySet:bing_obj['style']});
    });
    it('should getLayerFromLayerObj call the right get Layer functions via layer_obj.source', () => {
      let layer_obj:{source:string} = {};
      spyOn(layers, 'getMapboxLayer');
      spyOn(layers, 'getOpenstreetmapLayer');
      spyOn(layers, 'getBingLayer');
      spyOn(layers, 'getTmsLayer');
      spyOn(layers, 'getDefaultLayer');
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
      expect(layers.getDefaultLayer).toHaveBeenCalledWith(layer_obj);
    });


    it('setLayersChanges: should call addTmsLayersViaUrl and removeTmsLayersViaUrl and addBaseLayer if no tile layers in map', () => {
      let params:Params = {};
      let fake_parmas_layers_array:Array<Object> = [1,2,3];
      let fake_map_layers_array:Array<Object> = [4,5,6];
      let noTileLayerRes:boolean = false;

      spyOn(queryParamsHelperService, 'queryLayers').and.callFake(() => fake_parmas_layers_array);
      spyOn(layers, 'getTileLayersArray').and.callFake(() => fake_map_layers_array);

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
      let layer_b = {url:'layer_b_url', source:'bing', addTo: () => {}};
      let params_layers = [layer_a,layer_b];

      spyOn(layers, 'layerExistOnMap').and.callFake((layer) => _.isEqual(layer, layer_a)); // layer_b return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_b);
      spyOn(layer_b, 'addTo');

      layers.addLayersViaUrl(params_layers);
      expect(layer_b.addTo).toHaveBeenCalledWith(component.map);
    });

    it('removeLayersViaUrl should remove layers that exists on map but not exists on params', ()=>{
      let layer_a = {url:'layer_a_url'};
      let layer_b = {url:'layer_b_url'};
      let map_layers = [layer_a, layer_b];

      spyOn(layers, 'layerExistOnParams').and.callFake( ([], layer) => _.isEqual(layer, layer_b)); // layer_a return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_a);
      spyOn(component.map, 'removeLayer');

      layers.removeLayersViaUrl(map_layers);

      expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
      expect(component.map.removeLayer).toHaveBeenCalledWith(layer_a);
    });

    it('noTileLayer should return true if getTileLayersArray array is empty', ()=>{
      let getTileLayersArrayRes = [1,2,3];
      spyOn(layers, "getTileLayersArray").and.callFake(() => getTileLayersArrayRes);
      expect(layers.noTileLayer()).toBeFalsy();
      getTileLayersArrayRes = [];
      expect(layers.noTileLayer()).toBeTruthy();
    });

    it('parseMapBoxUrl should check if format or mapid are empty and remove them from url', ()=>{
      let layer_obj = { url:'mapbox_url',access_token:'Hiyush'}; //empty format empty mapid
      expect(layers.parseMapboxUrl(layer_obj)).toEqual(`mapbox_url{z}/{x}/{y}?access_token=Hiyush`)
    });
    it('layersEqual should compere 2 imageryProviders and return if they are equals', () => {
      let layer ={_url:'a',options:{}};
      let _layer={_url: 'b',options:{}};
      expect(layers.layersEqual(layer, _layer)).toBeFalsy();
      _layer._url = 'a';
      expect(layers.layersEqual(layer, _layer)).toBeTruthy();
    });

    it('layerExistOnMap should get layer_obj and return  return if exist of map' , ()=>{
      let layer_obj_a = {source:'default', url:'fake_url_a'};
      let layer_obj_b = {source:'openstreetmap', url:'fake_url_b'};
      let layer_obj_c = {source:'mapbox', url:'fake_url_c'};

      let map_tile_layers = [
        layers.getLayerFromLayerObj(layer_obj_a),
        layers.getLayerFromLayerObj(layer_obj_b)
      ];

      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_a)).toBeTruthy();
      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_b)).toBeTruthy();
      expect(layers.layerExistOnMap(map_tile_layers, layer_obj_c)).toBeFalsy();

    });

    it('layerExistOnParams should get imageryProvider and return if exist of params' , ()=>{
      let layer_obj_a = {source:'default', url:'fake_url_a'};
      let layer_obj_b = {source:'openstreetmap', url:'fake_url_b'};
      let layer_obj_c = {source:'mapbox', url:'fake_url_c'};

      let params_layer_array            = [layer_obj_a,layer_obj_b];
      let layer_to_check:L.TileLayer  = layers.getLayerFromLayerObj(layer_obj_a);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_b);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_c);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeFalsy();
    });

    it("getLayersArray should return all layers in Array" , () => {
      let layars = [];
      component.map.eachLayer((lay)=>{layars.push(lay);});
      expect(layers.getLayersArray()).toEqual(layars);
    });


  })



});
