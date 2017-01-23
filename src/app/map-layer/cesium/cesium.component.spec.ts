/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { CesiumComponent } from './cesium.component';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";
import {RouterTestingModule} from "@angular/router/testing";
import {Router, NavigationEnd, Params, NavigationExtras} from "@angular/router";
import {Observer, Observable} from "rxjs";
import * as _ from 'lodash';
import {Layers} from "./cesium.component.layers";
import {Markers} from "./cesium.component.markers";



describe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let router:Router;
  let queryParamsHelperService:QueryParamsHelperService;
  let calcService:CalcService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CesiumComponent ],
      providers:[QueryParamsHelperService, GeneralCanDeactivateService, CalcService]
    })
    .compileComponents();
  }));

  beforeEach(inject([Router, QueryParamsHelperService, CalcService],(_router:Router, _queryParamsHelperService:QueryParamsHelperService, _calcService:CalcService) => {
    window['CESIUM_BASE_URL'] = 'http://mapmip.webiks.com/assets/Cesium';
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });


  it('onLeave: should remove MoveEnd Event,unsubscribe queryParamsSubscriber, call flyToCenterAndGetBounds and call obs.next with flyToCenterAndGetBounds response ', () => {

    let observer:Observer<boolean> = <any>{ next(bool:boolean):void {}};
    Observable.create((_observer:Observer<boolean>) => {observer = _observer});
    let bool_result:boolean = true
    let fake_obs = { subscribe: callback => callback(bool_result) };

    spyOn(component.viewer.camera.moveEnd._listeners, 'pop');
    spyOn(component.queryParamsSubscriber, 'unsubscribe');
    spyOn(component, 'flyToCenterAndGetBounds').and.returnValue(fake_obs);
    spyOn(observer, 'next');

    component.onLeave(observer);
    expect(component.viewer.camera.moveEnd._listeners.pop).toHaveBeenCalled();
    expect(component.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    expect(component.flyToCenterAndGetBounds).toHaveBeenCalled();
    expect(observer.next).toHaveBeenCalledWith(bool_result);

  });

  it('setQueryBoundsOnNavigationEnd: get url, parse url to UrlTree Object, add "bounds" to queryParams, parse back and navigate with new url', () => {
    spyOn(component, 'getBounds').and.returnValue([1,2,3,4]);
    spyOn(router, 'navigateByUrl');

    let event:NavigationEnd = <any> {url: "/cesium?lat=1&lng=2"}
    component.setQueryBoundsOnNavigationEnd(event);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/cesium?lat=1&lng=2&bounds=${encodeURIComponent("1,2,3,4")}`)
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

    it('setLayersChanges should to have been call if: noTileLayerRes is "true" or anyLayersChanges is "true"', ()=>{
      let anyLayersChangesRes:boolean = false;
      let noTileLayerRes:boolean = false;
      spyOn(component.layers,'noTileLayer').and.callFake(() => noTileLayerRes)
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

  it('initializeMap: should set cesium viewer, put bingDefultkey and add moveEnd event', () => {


  });


  it("anyParamChanges should get params and check if there's any changes between params and map" , () => {

    let params:Params = {
      lng: component.getCenter().lng,
      lat: component.getCenter().lat,
      height: component.viewer.camera.positionCartographic.height,
      heading: Cesium.Math.toDegrees(component.viewer.camera.heading) % 360,
      pitch: Cesium.Math.toDegrees(component.viewer.camera.pitch) % 360,
      roll: Cesium.Math.toDegrees(component.viewer.camera.roll) % 360,
      mode3d: component.viewer.scene.mode == Cesium.SceneMode.SCENE3D ? 1 : 0,
      rotate: component.viewer.scene.mapMode2D == Cesium.MapMode2D.INFINITE_SCROLL ? undefined : 1
    };

    expect(component.anyParamChanges(params)).toBeFalsy();
    params['lng'] = component.getCenter().lng + 2;
    expect(component.anyParamChanges(params)).toBeTruthy();
  });

  it('setMapView should get params and use them to set rotate, set mode and call map.setView with params values',()=>{
    spyOn(component.viewer.camera, 'setView');

    let params:Params = {
      lng: 1,
      lat: 2,
      heading:3,
      pitch:4,
      roll: 5,
      height:6,
      rotate: undefined,
      mode3d: 1
    };

    component.setMapView(params);

    let view_to_call_with =  {
      destination: Cesium.Cartesian3.fromDegrees(...[params['lng'],params['lat'],params['height']]),
      orientation: {heading:Cesium.Math.toRadians(params['heading']), pitch: Cesium.Math.toRadians(params['pitch']), roll: Cesium.Math.toRadians(params['roll']) }
    };

    expect(component.viewer.camera.setView).toHaveBeenCalledWith(view_to_call_with);
    expect(component.viewer.scene.mode).toEqual(Cesium.SceneMode.SCENE3D);
    expect(component.viewer.scene.mapMode2D).toEqual(Cesium.MapMode2D.INFINITE_SCROLL);
  });


  it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {

    let resultAnyParamsChange:boolean = false;
    spyOn(router, 'navigate');
    spyOn(component, 'anyParamChanges').and.callFake(() => resultAnyParamsChange);
    component.moveEnd();
    expect(router.navigate).not.toHaveBeenCalled();

    component.currentParams['layers'] = "(url:'fake_url')";
    component.currentParams['markers'] = "(1,2,3)";

    resultAnyParamsChange = true;
    component.moveEnd();
    let center: {lat:number, lng:number} = component.getCenter();
    if(!center) return;
    let lat:number = center.lat;
    let lng:number = center.lng;
    let height:number = component.viewer.camera.positionCartographic.height;//.toFixed(7);
    let heading:number = +Cesium.Math.toDegrees(component.viewer.camera.heading);//.toFixed(7);

    let pitch:number = +Cesium.Math.toDegrees(component.viewer.camera.pitch);//.toFixed(7);
    let roll:number = +Cesium.Math.toDegrees(component.viewer.camera.roll);//.toFixed(7);
    let mode3d:number = component.viewer.scene.mode == Cesium.SceneMode.SCENE2D ? 0 : 1;
    let markers = component.currentParams['markers'];
    let layers = component.currentParams['layers'];
    let rotate = component.viewer.scene._mapMode2D == Cesium.MapMode2D.ROTATE ? 1 : undefined;

    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, mode3d, markers, layers, rotate});
    expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);
  });

  it('getCenter should return object with lng and lat (degrees) of the center', () => {
    let latitude = Cesium.Math.toDegrees(component.viewer.camera.positionCartographic.latitude);
    let longitude = Cesium.Math.toDegrees(component.viewer.camera.positionCartographic.longitude);
    let result = calcService.toFixes7Obj({lng:longitude,lat:latitude});
    expect(component.getCenter()).toEqual(result)
  });

  it('setMapBounds should get params and use them to call setView' , () => {
    spyOn(component.viewer.camera, 'setView');

    let params:Params = {
      bounds :'1,2,3,4',
      heading: 90
    };
    let viewObj = {
      destination: Cesium.Rectangle.fromDegrees(...[1,2,3,4]),
      orientation: {heading: Cesium.Math.toRadians(90)}
    };

    component.setMapBounds(params);
    expect(component.viewer.camera.setView).toHaveBeenCalledWith(viewObj);
  });

  it("getBounds should get bounds from calcBounds function and return the bounds as [number,number,number,number]" , () => {
    spyOn(component,'calcBounds').and.returnValue([1,2,3,4]);
    let expectResult = [1,2,3,4].map( (value:number) => Cesium.Math.toDegrees(value));
    let getBoundsResult = component.getBounds();
    expect(component['calcBounds']()).toEqual([1,2,3,4]);
    expect(getBoundsResult).toEqual(expectResult )
  });
  it('flyToCenterAndGetBounds shuold call flyTo with right values, only when sceneMode on SCENE3D and heading, roll, pitch not equal to zero', () => {
    spyOn(component.viewer.camera, 'flyTo');
    component.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    component.flyToCenterAndGetBounds().toPromise().then(()=>{
      expect(component.viewer.camera.flyTo).not.toHaveBeenCalled();
      component.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
      component.flyToCenterAndGetBounds().toPromise().then(()=>{
        expect(component.viewer.camera.flyTo).toHaveBeenCalled();
      });
    });
  });


  describe('markers', ()=> {
    let markers:Markers;

    beforeEach(()=>{
      markers = component.markers;
    });

    it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', ()=>{
      let params_markers_position:Array<[number, number]> = [[1,2,3], [4,5,6]];
      let map_markers_positions:Array<[number, number]> = [[6,7,8], [5,4,3]];

      spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers_position);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers_positions);

      spyOn(markers, 'addMarkersViaUrl');
      spyOn(markers, 'removeMarkersViaUrl');
      markers.setMarkersChanges({});
      expect(markers.addMarkersViaUrl).toHaveBeenCalledWith(params_markers_position);
      expect(markers.removeMarkersViaUrl).toHaveBeenCalledWith(map_markers_positions);
    });


    it('addMarkersViaUrl: should get positions array from params. for each position create marker if not exists on map', ()=>{
      let params_markers_position:Array<[number, number]> = [[1,2,3], [4,5,6]];
      markers.addMarkersViaUrl(params_markers_position);
      let position_of_map_markers = markers.getMarkersPosition();
      expect(position_of_map_markers).toEqual([Cesium.Cartesian3.fromDegrees(...[1,2,3]),Cesium.Cartesian3.fromDegrees(...[4,5,6])]);
    });

    it('removeMarkersViaUrl: addMarkersViaUrl: should get positions array from map. for each position remvoe marker if not exists on params', ()=>{
      component.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(...[1,2,3]),
        billboard: {
          image: "/assets/Leaflet/images/marker-icon.png"
        }
      });
      component.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(...[4,5,6]),
        billboard: {
          image: "/assets/Leaflet/images/marker-icon.png"
        }
      });
      let position_of_map_markers = markers.getMarkersPosition();

      expect(markers.getMarkersPosition()).toEqual([Cesium.Cartesian3.fromDegrees(...[1,2,3]),Cesium.Cartesian3.fromDegrees(...[4,5,6])]);

      component.currentParams = {markers: '(1,2,3)'}; // (3,4) should be removed
      markers.removeMarkersViaUrl(position_of_map_markers);

      expect(markers.getMarkersPosition()).toEqual([Cesium.Cartesian3.fromDegrees(...[1,2,3])]);
    });

    it('markerExistOnMap: should get one position and return if there is marker on map with that position', ()=>{
      component.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(...[1,2,3]),
        billboard: {
          image: "/assets/Leaflet/images/marker-icon.png"
        }
      });
      expect(markers.markerExistOnMap([1,2,3])).toBeTruthy();
      expect(markers.markerExistOnMap([4,5,6])).toBeFalsy();
    });

    it('markerExistOnParams: should get one position and return if there is marker on params with that position', () => {
      component.currentParams = {
        markers: '(1,2,3),(4,5,6)'
      };
      expect(markers.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[1,2,3]))).toBeTruthy();
      expect(markers.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[4,5,6]))).toBeTruthy();
      expect(markers.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[7,8,9]))).toBeFalsy();
    });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
      let marker1 = [30,20,10];
      let marker2 = [60,50,40];
      let marker1_cartesian = Cesium.Cartesian3.fromDegrees(...marker1);
      let marker2_cartesian = Cesium.Cartesian3.fromDegrees(...marker2);

      let params_markers = [marker1, marker2];
      let map_markers = [marker1_cartesian, marker2_cartesian];

      spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);

      expect(markers.anyMarkersMapChanges({})).toBeFalsy();
      params_markers[0] = [31,20,10];
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();

      expect(queryParamsHelperService.queryMarkers).toHaveBeenCalledTimes(2);
      expect(markers.getMarkersPosition).toHaveBeenCalledTimes(2);
    });

    it('getMarkersPosition should return positions array ( [lng, lat], [lng, lat],...)', ()=>{
      component.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(...[1,2,3]),
        billboard: {
          image: "/assets/Leaflet/images/marker-icon.png"
        }
      });
      component.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(...[4,5,6]),
        billboard: {
          image: "/assets/Leaflet/images/marker-icon.png"
        }
      });
      expect(markers.getMarkersPosition().length).toEqual(2);
      expect(markers.getMarkersPosition()[0]).toEqual(Cesium.Cartesian3.fromDegrees(...[1,2,3]));
      expect(markers.getMarkersPosition()[1]).toEqual(Cesium.Cartesian3.fromDegrees(...[4,5,6]));
    });

  });








  describe("layers", () => {
    let layers:Layers;

    beforeEach(()=>{
      layers = component.layers;
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
      let layer_obj:{source:string} = {};
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
