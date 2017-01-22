/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { CesiumComponent } from './cesium.component';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";
import {RouterTestingModule} from "@angular/router/testing";
import {Router, NavigationEnd, Params, NavigationExtras} from "@angular/router";
import {Observer, Observable} from "rxjs";

fdescribe('CesiumComponent', () => {
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

    spyOn(component.viewer.camera.moveEnd, 'removeEventListener');
    spyOn(component.queryParamsSubscriber, 'unsubscribe');
    spyOn(component, 'flyToCenterAndGetBounds').and.returnValue(fake_obs);
    spyOn(observer, 'next');

    component.onLeave(observer);
    expect(component.viewer.camera.moveEnd.removeEventListener).toHaveBeenCalled();
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
      spyOn(component,'noTileLayer').and.callFake(() => noTileLayerRes)
      spyOn(queryParamsHelperService, 'anyLayersChanges').and.callFake(() => anyLayersChangesRes);
      spyOn(component, 'setLayersChanges');

      let params:Params = {};
      component.queryParams(params);
      expect(component.setLayersChanges).not.toHaveBeenCalled();
      anyLayersChangesRes = true;
      component.queryParams(params);
      expect(component.setLayersChanges).toHaveBeenCalledWith(params);
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

      spyOn(component, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(component, 'setMarkersChanges');

      let params:Params = {
        lat:'1.123',
        lng:'4.567',
        markers: '(1,2,3),(4,5,6)'
      };

      params_changes = true;
      map_changes = false;
      component.queryParams(params);
      expect(component.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = false;
      map_changes = true;
      component.queryParams(params);
      expect(component.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = true;
      map_changes = true;
      component.queryParams(params);
      expect(component.setMarkersChanges).toHaveBeenCalledWith(params);

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

  it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
    let marker1 = [30,20,10];
    let marker2 = [60,50,40];
    let marker1_cartesian = Cesium.Cartesian3.fromDegrees(...marker1);
    let marker2_cartesian = Cesium.Cartesian3.fromDegrees(...marker2);

    let params_markers = [marker1, marker2];
    let map_markers = [marker1_cartesian, marker2_cartesian];

    spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers);
    spyOn(component, 'getMarkersPosition').and.callFake(() => map_markers);

    expect(component.anyMarkersMapChanges({})).toBeFalsy();
    params_markers[0] = [31,20,10];
    expect(component.anyMarkersMapChanges({})).toBeTruthy();

    expect(queryParamsHelperService.queryMarkers).toHaveBeenCalledTimes(2);
    expect(component.getMarkersPosition).toHaveBeenCalledTimes(2);
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
    expect(component.getMarkersPosition().length).toEqual(2);
    expect(component.getMarkersPosition()[0]).toEqual(Cesium.Cartesian3.fromDegrees(...[1,2,3]));
    expect(component.getMarkersPosition()[1]).toEqual(Cesium.Cartesian3.fromDegrees(...[4,5,6]));
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

  it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', ()=>{
    let params_markers_position:Array<[number, number]> = [[1,2,3], [4,5,6]];
    let map_markers_positions:Array<[number, number]> = [[6,7,8], [5,4,3]];

    spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers_position);
    spyOn(component, 'getMarkersPosition').and.callFake(() => map_markers_positions);

    spyOn(component, 'addMarkersViaUrl');
    spyOn(component, 'removeMarkersViaUrl');
    component.setMarkersChanges({});
    expect(component.addMarkersViaUrl).toHaveBeenCalledWith(params_markers_position);
    expect(component.removeMarkersViaUrl).toHaveBeenCalledWith(map_markers_positions);
  });


  it('addMarkersViaUrl: should get positions array from params. for each position create marker if not exists on map', ()=>{
    let params_markers_position:Array<[number, number]> = [[1,2,3], [4,5,6]];
    component.addMarkersViaUrl(params_markers_position);
    let position_of_map_markers = component.getMarkersPosition();
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
    let position_of_map_markers = component.getMarkersPosition();

    expect(component.getMarkersPosition()).toEqual([Cesium.Cartesian3.fromDegrees(...[1,2,3]),Cesium.Cartesian3.fromDegrees(...[4,5,6])]);

    component.currentParams = {markers: '(1,2,3)'}; // (3,4) should be removed
    component.removeMarkersViaUrl(position_of_map_markers);

    expect(component.getMarkersPosition()).toEqual([Cesium.Cartesian3.fromDegrees(...[1,2,3])]);
  });

  it('markerExistOnMap: should get one position and return if there is marker on map with that position', ()=>{
    component.viewer.entities.add({
      position : Cesium.Cartesian3.fromDegrees(...[1,2,3]),
      billboard: {
        image: "/assets/Leaflet/images/marker-icon.png"
      }
    });
    expect(component.markerExistOnMap([1,2,3])).toBeTruthy();
    expect(component.markerExistOnMap([4,5,6])).toBeFalsy();
  });

  it('markerExistOnParams: should get one position and return if there is marker on params with that position', () => {
    component.currentParams = {
      markers: '(1,2,3),(4,5,6)'
    };
    expect(component.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[1,2,3]))).toBeTruthy();
    expect(component.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[4,5,6]))).toBeTruthy();
    expect(component.markerExistOnParams(Cesium.Cartesian3.fromDegrees(...[7,8,9]))).toBeFalsy();
  });


  it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {

    let resultAnyParamsChange:boolean = false;
    spyOn(router, 'navigate');
    spyOn(component, 'anyParamChanges').and.callFake(() => resultAnyParamsChange);
    component.moveEnd();
    expect(router.navigate).not.toHaveBeenCalled();

    component.currentParams['tms'] = "(url:'fake_url')";
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
    let tms = component.currentParams['tms'];
    let rotate = component.viewer.scene._mapMode2D == Cesium.MapMode2D.ROTATE ? 1 : undefined;

    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, mode3d, markers, tms, rotate});
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
  it('addBaseLayer should get bing layer and add layer to viewer imageryProviders', ()=> {
    let fake_base_layer = {name:'bing_base_layer'};
    spyOn(component, 'getBingLayer').and.callFake(() => fake_base_layer);
    spyOn(component.viewer.imageryLayers, 'addImageryProvider');
    component.addBaseLayer();
    expect(component.viewer.imageryLayers.addImageryProvider).toHaveBeenCalledWith(fake_base_layer)
  });
  it('getBingLayer should return BingImageryProvider with mapStyle key and url', ()=>{
    let layer_obj = {url:'fake_url', style:'fake_style', key:'fake_key'};
    let bing_layer = component.getBingLayer(layer_obj);
    expect(bing_layer instanceof Cesium.BingMapsImageryProvider).toBeTruthy();
  });
  it('should getLayerFromLayerObj call the right get Layer functions via layer_obj.source', () => {
    let layer_obj:{source:string} = {};
    spyOn(component, 'getMapboxLayer');
    spyOn(component, 'getOpenstreetmapLayer');
    spyOn(component, 'getBingLayer');
    spyOn(component, 'getTmsLayer');
    spyOn(component, 'getUrlTemplateLayer');
    layer_obj.source = "mapbox";
    component.getLayerFromLayerObj(layer_obj);
    expect(component.getMapboxLayer).toHaveBeenCalledWith(layer_obj);
    layer_obj.source = "bing";
    component.getLayerFromLayerObj(layer_obj);
    expect(component.getBingLayer).toHaveBeenCalledWith(layer_obj);
    layer_obj.source = "openstreetmap";
    component.getLayerFromLayerObj(layer_obj);
    expect(component.getOpenstreetmapLayer).toHaveBeenCalledWith(layer_obj);
    layer_obj.source = "tms";
    component.getLayerFromLayerObj(layer_obj);
    expect(component.getTmsLayer).toHaveBeenCalledWith(layer_obj);
    layer_obj.source = "default";
    component.getLayerFromLayerObj(layer_obj);
    expect(component.getUrlTemplateLayer).toHaveBeenCalledWith(layer_obj);
  });


  fit('setTmsLayers: should call addTmsLayersViaUrl and removeTmsLayersViaUrl and addBaseLayer if no tile layers in map', () => {
    let params:Params = {};
    let fake_parmas_layers_array:Array<Object> = [1,2,3];
    let fake_map_layers_array:Array<Object> = [4,5,6];
    let noTileLayerRes:boolean = false;

    spyOn(queryParamsHelperService, 'queryLayers').and.callFake(() => fake_parmas_layers_array);
    component.viewer.imageryLayers._layers = fake_map_layers_array;
    spyOn(component, 'addLayersViaUrl');
    spyOn(component, 'removeLayersViaUrl');
    spyOn(component, 'addBaseLayer');
    spyOn(component, 'noTileLayer').and.callFake(() => noTileLayerRes);

    component.setLayersChanges(params);
    expect(component.addLayersViaUrl).toHaveBeenCalledWith(fake_parmas_layers_array);
    expect(component.removeLayersViaUrl).toHaveBeenCalledWith(fake_map_layers_array);
    expect(component.addBaseLayer).not.toHaveBeenCalled();
    noTileLayerRes = true;
    component.setLayersChanges(params);
    expect(component.addBaseLayer).toHaveBeenCalled();

  });

  // it('tmsUrlExistOnMap should get _url and return if one of map urls equal to _url' , ()=>{
  //   spyOn(component, 'getMapTmsUrls').and.callFake(() => ["url1", "url2", "url3"]);
  //   expect(component.tmsUrlExistOnMap("url1")).toBeTruthy();
  //   expect(component.tmsUrlExistOnMap("url2")).toBeTruthy();
  //   expect(component.tmsUrlExistOnMap("url3")).toBeTruthy();
  //   expect(component.tmsUrlExistOnMap("url4")).toBeFalsy();
  // });
  //
  // it('tmsUrlExistOnParams should get _url and return if one of params urls equal to _url' , ()=>{
  //   spyOn(queryParamsHelperService, 'queryTms').and.callFake(() => ["url4", "url5", "url6"]);
  //   expect(component.tmsUrlExistOnParams("url4")).toBeTruthy();
  //   expect(component.tmsUrlExistOnParams("url5")).toBeTruthy();
  //   expect(component.tmsUrlExistOnParams("url6")).toBeTruthy();
  //   expect(component.tmsUrlExistOnParams("url7")).toBeFalsy();
  // })

});
