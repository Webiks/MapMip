/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { OpenlayersComponent } from './openlayers.component';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc-service";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {RouterTestingModule} from "@angular/router/testing";
import {Observer, Observable} from "rxjs";
import {NavigationEnd, Router, Params, NavigationExtras} from "@angular/router";
import * as ol from 'openlayers';
import {AjaxService} from "../ajax.service";
import {HttpModule} from "@angular/http";
import {OpenlayersMarkers} from "./openlayers.component.markers";
import {OpenlayersLayers} from "./openlayers.component.layers";
import {PositionFormService} from "../position-form/position-form.service";

describe('OpenlayersComponent', () => {
  let component: OpenlayersComponent;
  let fixture: ComponentFixture<OpenlayersComponent>;
  let calcService: CalcService;
  let router:Router;
  let queryParamsHelperService:QueryParamsHelperService;
  let positionFormService:PositionFormService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule],
      declarations: [ OpenlayersComponent ],
      providers: [QueryParamsHelperService, CalcService,GeneralCanDeactivateService, AjaxService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([CalcService, Router, QueryParamsHelperService, PositionFormService],(_calcService:CalcService, _router:Router, _queryParamsHelperService:QueryParamsHelperService, _positionFormService:PositionFormService) => {
    fixture = TestBed.createComponent(OpenlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    calcService = _calcService;
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    positionFormService = _positionFormService;
  }));

  it('should component be defined', () => {
    expect(component).toBeDefined();
  });

  it('onLeave should check rotation and go_north value and animate to current rotation if need', () => {
    let observer:Observer<boolean> = <any>{ next(bool:boolean):void {}};
    Observable.create((_observer:Observer<boolean>) => {observer = _observer});

    let rotataion = 0;
    component.go_north = true;

    let view = component.map.getView();
    spyOn(observer, 'next');
    spyOn(view, 'animate');
    spyOn(view, 'getRotation').and.callFake(() => rotataion);

    component.onLeave(observer);
    expect(observer.next).toHaveBeenCalledWith(true);

    rotataion = 1;
    component.go_north = false;

    component.onLeave(observer);
    expect(observer.next).toHaveBeenCalledWith(true);
    expect(observer.next).toHaveBeenCalledTimes(2);

    rotataion = calcService.toRadians(179);
    component.go_north = true;
    component.onLeave(observer);
    expect(view.animate).toHaveBeenCalledWith({rotation:0, duration:500}, component.andRotation)

    rotataion = calcService.toRadians(181);
    component.go_north = true;
    component.onLeave(observer);
    expect(view.animate).toHaveBeenCalledWith({rotation: Cesium.Math.toRadians(360), duration:500}, component.andRotation)

  });

  it('setQueryBoundsOnNavigationEnd: get url, parse url to UrlTree Object, add "bounds" to queryParams, parse back and navigate with new url', () => {
    spyOn(component, 'getBounds').and.returnValue([1,2,3,4]);
    spyOn(router, 'navigateByUrl');

    let event:NavigationEnd = <any> {url: "/cesium?lat=1&lng=2"}
    component.setQueryBoundsOnNavigationEnd(event);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/cesium?lat=1&lng=2&bounds=${encodeURIComponent("1,2,3,4")}`)
  });

  describe('queryParams: ',() => {
    let markers:OpenlayersMarkers;
    beforeEach(()=>{
      markers = component.markers
    });
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
      spyOn(markers, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(markers, 'setMarkersChanges');

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

  });

  it('setMapView should get params and use them to call map.setView with params values',()=>{
    spyOn(component.map, 'setView');
    spyOn(ol, 'View').and.callFake(() => "viewConstructor");
    spyOn(calcService, 'toRadians').and.returnValue(0);

    let params:Params = {
      lng: 1,
      lat: 2,
      zoom :10
    };

    let viewObj = {
      center: ol.proj.fromLonLat([1,2]),
      zoom: 10,
      rotation: 0
    };

    component.setMapView(params);
    expect(ol.View).toHaveBeenCalledWith(viewObj);
    expect(component.map.setView).toHaveBeenCalled();
  });


  it('setMapBounds should get bounds and rotation from params and use them to call view.fit and view.setRotation' , () => {
    let view = component.map.getView();
    spyOn(view, 'fit');
    spyOn(view, 'setRotation');

    let params:Params = {
      bounds: '1,2,3,4',
      heading: '270'
    };

    component.setMapBounds(params);
    expect(view.fit).toHaveBeenCalledWith(component.transformExtent([1,2,3,4]), component.map.getSize());
    expect(view.setRotation).toHaveBeenCalledWith(calcService.toRadians(90));
  });


  it("anyParamChanges should get params and check if there's any changes between params and map" , () => {
    let center = [1.11111111111111111,2.222222222222222222];
    let zoom = 10;
    let heading = calcService.toRadians(90);

    let getCenter = () => center;
    let getZoom = () => zoom;
    let getRotation = () => heading;

    let params:Params = {
      lng: 1.11111111111111111111111111,
      lat: 2.22222222222222222222222222,
      zoom :10,
      heading: '270'
    };

    let view = component.map.getView();
    spyOn(view, 'getCenter').and.callFake(getCenter);
    spyOn(view, 'getZoom').and.callFake(getZoom);
    spyOn(view, 'getRotation').and.callFake(getRotation);

    expect(component.anyParamChanges(params)).toBeFalsy();
    params['zoom'] = 12;
    expect(component.anyParamChanges(params)).toBeTruthy();
  });


  it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {
    spyOn(router, 'navigate');
    spyOn(ol.proj, 'transform').and.returnValue([2,1]);
    component.currentParams = {markers: '(1,2,3)', layers: 'tms_strings', rotate: '0'};

    let event = {
      map: {
        getView: () => {
          return {
            getCenter: () => {
              return {
                lat: 1,
                lng: 2
              }
            },
            getZoom: () => 10,
            getRotation: () => 0
          }
        }
      }
    };

    component.moveEnd(event);
    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, heading: 0, markers: '(1,2,3)', layers:'tms_strings', rotate: 0});
    expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);

    component.currentParams['rotate'] = '1';
    component.moveEnd(event);
    navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, heading: 0, markers: '(1,2,3)', layers:'tms_strings', rotate: undefined});
    expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);
  });

  it('transformExtent should can extent on EPSG:4326 projection and transform extent to EPSG ', () => {
    spyOn(ol.proj,'transformExtent');
    component.transformExtent([1,2,3,4]);
    expect(ol.proj.transformExtent).toHaveBeenCalledWith([1,2,3,4], 'EPSG:4326', 'EPSG:3857');
  });

  it('getBounds: should initialize rotation to zero, get bounds from map, transform them to EPSG:4326 , return them as [number, number, number, number] and set rotation to saved rotation', () => {
    let rotation_radian = calcService.toRadians(0);
    component.map.getView().setRotation(rotation_radian);
    // let view = component.map.getView();
    // spyOn(view, 'calculateExtent').and.returnValue(ol.proj.transformExtent([1,2,3,4], 'EPSG:4326', 'EPSG:3857'));
    let bounds_with_rotation_0 = component.getBounds();
    rotation_radian = calcService.toRadians(90);
    component.map.getView().setRotation(rotation_radian);
    let bounds_with_rotation_90 = component.getBounds();

    expect(bounds_with_rotation_0).toEqual(bounds_with_rotation_90);
  });

  describe("markers", ()=>{
    let markers:OpenlayersMarkers;

    beforeEach(()=>{
      markers = component.markers
    });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
      let params = {};
      let params_markers = [{position: [30,20], color:"green"}, {position: [60,50]}];
      let map_markers = [{position: [30,20], color:"green"}, {position: [60,50], color:"blue"}];
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      expect(markers.anyMarkersMapChanges(params)).toBeFalsy();
      params_markers[1]['color'] = "red";
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();
    });


    it('getMarkersPosition should return positions array ( {position,color}, {position,color},...)', ()=>{
      let marker_a = {position: [20,30], color:"red"};
      let marker_b = {position: [40,50]};
      markers.addIcon(marker_a);
      markers.addIcon(marker_b);
      expect(markers.getMarkersPosition().length).toEqual(2);
      expect(markers.getMarkersPosition()[0]).toEqual({position: [20, 30], color:"red"});
      expect(markers.getMarkersPosition()[1]).toEqual({position: [40, 50], color:"blue"});
    });

    it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', ()=>{
      let params_markers = [{position: [30,20], color:"green"}, {position: [60,50]}];
      let map_markers = [{position: [30,20], color:"green"}, {position: [60,50], color:"blue"}];
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      spyOn(markers, 'addMarkersViaUrl');
      spyOn(markers, 'removeMarkersViaUrl');
      markers.setMarkersChanges({});
      expect(markers.addMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
      expect(markers.removeMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
    });

    it('addMarkersViaUrl: should get {positions,color} array from params. for each {positions,color} create marker if not exists on map', ()=>{
      spyOn(markers, 'addIcon');
      let params_markers = [{position: [30,20], color:"green"}, {position: [60,50], color:"red"}];
      let map_markers = [{position: [30,20], color:"green"}];
      markers.addMarkersViaUrl(params_markers, map_markers);
      expect(markers.addIcon).toHaveBeenCalledWith({position: [60,50], color:"red"});
      expect(markers.addIcon).toHaveBeenCalledTimes(1);
    });

    it('removeMarkersViaUrl: should get {positions,color} array from map. for each {position,color} remove marker if not exists on params', ()=>{
      let not_exist_marker = {position: [60,50], color:"red"};
      spyOn(markers, "removeIcon");
      let params_markers = [{position: [30,20], color:"green"}];
      let map_markers = [{position: [30,20], color:"green"}, not_exist_marker];
      markers.removeMarkersViaUrl(params_markers, map_markers);
      expect(markers.removeIcon).toHaveBeenCalledWith(not_exist_marker);
    });

    it('markerExistOnMap: should get one {position,color} and return if there is marker on map with that {position,color}', ()=>{
      let existMarkerObj = {position: [60,50]};
      let notExistMarkerObj = {position: [60,50], color: "red"};
      let map_markers = [{position: [60,50], color:"blue"}];
      expect(markers.markerExistOnMap(map_markers, existMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnMap(map_markers, notExistMarkerObj)).toBeFalsy();
    });

    it('markerExistOnParams: should get one position and return if there is marker on params with that position', ()=>{
      let existMarkerObj = {position: [60,50], color:"blue"};
      let notExistMarkerObj = {position: [60,50], color:"red"};
      let params_markers = [{position: [60,50]}];
      expect(markers.markerExistOnParams(params_markers, existMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnParams(params_markers, notExistMarkerObj)).toBeFalsy();
    });

    it("toggleMarkerPicker should get checked variable and invoke different functions accordingly", ()=>{
      spyOn(component.map,'on').and.callFake(() => "fakeLeftClickHandlerRes");
      spyOn(component.map,'unByKey');

      markers.toggleMarkerPicker(true);
      expect(component.map.on).toHaveBeenCalled();
      expect(markers.leftClickHandler).toEqual("fakeLeftClickHandlerRes");

      markers.toggleMarkerPicker(false);
      expect(component.map.unByKey).toHaveBeenCalledWith(markers.leftClickHandler);
    });

     it("leftClickInputAction should get event with coordinates and should convert toLonLat, and call addMarker with latlng", () => {
       let event:{coordinate:[number,number]} = {coordinate:[30,30]} ;
       spyOn(component.queryParamsHelperService,'addMarker');
       spyOn(ol.proj,'toLonLat').and.callFake((coordinate:[number,number]) => coordinate);
       positionFormService.selectedColorIndex = positionFormService.getSelectedColorIndex("yellow");
       markers.leftClickInputAction(event);
       expect(component.queryParamsHelperService.addMarker).toHaveBeenCalledWith({position: event.coordinate, color:"yellow"});
     });

  });

  describe("layers", ()=>{
    let layers:OpenlayersLayers;

    beforeEach(()=>{
      layers = component.layers;
    });

    it('addBaseLayer should get bing layer and add layer to viewer imageryProviders', ()=> {
      let fake_layer = {};
      spyOn(layers, "getBingLayer").and.callFake(() => fake_layer);
      spyOn(component.map, 'addLayer');
      layers.addBaseLayer();
      expect(layers.getBingLayer).toHaveBeenCalled();
      expect(component.map.addLayer).toHaveBeenCalledWith(fake_layer);
    });


    it('getBingLayer should return BingImageryProvider with mapStyle key and url', ()=>{
      let bing_obj = {key:'fake_key', style:'fake_style'};
      let bing_layer = layers.getBingLayer(bing_obj);

      expect(bing_layer instanceof ol.layer.Tile).toBeTruthy();
      expect(bing_layer.getSource() instanceof ol.source.BingMaps).toBeTruthy();
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
      let layer_b = {url:'layer_b_url', source:'bing'};
      let params_layers = [layer_a,layer_b];

      spyOn(layers, 'layerExistOnMap').and.callFake((layer) => _.isEqual(layer, layer_a)); // layer_b return false
      spyOn(layers, 'getLayerFromLayerObj').and.callFake(() => layer_b);
      spyOn(component.map, 'addLayer');

      layers.addLayersViaUrl(params_layers);
      expect(component.map.addLayer).toHaveBeenCalledWith(layer_b);
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

    it('layersEqual should compere 2 layers and return if they are equals', () => {
      let source = {c:'c',jc:"jc", o: "o"};
      let _source = {c:'c',jc:"jc", o: "o1"};

      let layer  = {getSource: () => new Object(source)};
      let _layer = {getSource: () => new Object(_source)};

      expect(layers.layersEqual(layer, _layer)).toBeFalsy();

      _source.o = "o";

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
      let layer_to_check:ol.layer.Layer  = layers.getLayerFromLayerObj(layer_obj_a);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_b);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeTruthy();
      layer_to_check = layers.getLayerFromLayerObj(layer_obj_c);
      expect(layers.layerExistOnParams(params_layer_array, layer_to_check)).toBeFalsy();
    });


  })
});
