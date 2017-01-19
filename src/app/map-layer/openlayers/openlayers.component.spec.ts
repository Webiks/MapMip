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

describe('OpenlayersComponent', () => {
  let component: OpenlayersComponent;
  let fixture: ComponentFixture<OpenlayersComponent>;
  let calcService: CalcService;
  let router:Router;
  let queryParamsHelperService:QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ OpenlayersComponent ],
      providers: [QueryParamsHelperService, CalcService,GeneralCanDeactivateService]
    })
      .compileComponents();
  }));

  beforeEach(inject([CalcService, Router, QueryParamsHelperService],(_calcService:CalcService, _router:Router, _queryParamsHelperService:QueryParamsHelperService) => {
    fixture = TestBed.createComponent(OpenlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    calcService = _calcService;
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
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
      spyOn(component, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(component, 'setMarkersChanges');

      let params:Params = {
        lat:'1.123',
        lng:'4.567',
        zoom: '5',
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

    });

    it('setTmsLayers should to have been call if: noTileLayerRes is "true" or anyTmsChanges is "true"', ()=>{
      let params:Params = {};
      let anyTmsChangesRes:boolean = false;
      let noTileLayerRes:boolean = false;

      spyOn(component,'noTileLayer').and.callFake(() => noTileLayerRes)
      spyOn(queryParamsHelperService, 'anyTmsChanges').and.callFake(() => anyTmsChangesRes);

      spyOn(component, 'setTmsLayers');
      component.queryParams(params);
      expect(component.setTmsLayers).toHaveBeenCalledTimes(0);
      anyTmsChangesRes = true;
      noTileLayerRes = true;
      component.queryParams(params);
      expect(component.setTmsLayers).toHaveBeenCalledWith(params);
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
    component.currentParams = {markers: '(1,2,3)', tms: 'tms_strings', rotate: '0'};

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
    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, heading: 0, markers: '(1,2,3)', tms:'tms_strings', rotate: 0});
    expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);

    component.currentParams['rotate'] = '1';
    component.moveEnd(event);
    navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, heading: 0, markers: '(1,2,3)', tms:'tms_strings', rotate: undefined});
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

  it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
    let params_markers = [1,2,3];
    let map_markers = [1,2,3,4];
    spyOn(component, 'getMarkersPosition').and.callFake(()=>params_markers);
    spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(()=>map_markers);
    expect(component.anyMarkersMapChanges({})).toBeTruthy();
    params_markers = [1,2,3,4,5];
    map_markers    = [1,2,3,4,5];
    expect(component.anyMarkersMapChanges({})).toBeFalsy();
  });

  it('getMarkersPosition should return positions array ( [lng, lat], [lng, lat],...)', ()=>{
    component.addIcon([30,20]);
    component.addIcon([50,40]);
    expect(component.getMarkersPosition().length).toEqual(2);
    expect(component.getMarkersPosition()[0]).toEqual([30,20]);
    expect(component.getMarkersPosition()[1]).toEqual([50,40]);
  });

  it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', ()=>{
    let params_markers_position:Array<[number, number]> = [[1,2], [4,5]];
    let map_markers_positions:Array<[number, number]> = [[6,7], [8,9]];

    spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers_position);
    spyOn(component, 'getMarkersPosition').and.callFake(() => map_markers_positions);

    spyOn(component, 'addMarkersViaUrl');
    spyOn(component, 'removeMarkersViaUrl');
    component.setMarkersChanges({});
    expect(component.addMarkersViaUrl).toHaveBeenCalledWith(params_markers_position);
    expect(component.removeMarkersViaUrl).toHaveBeenCalledWith(map_markers_positions);
  });


  it('addMarkersViaUrl: should get positions array from params. for each position create marker if not exists on map', ()=>{
    let params_markers_position:Array<[number, number]> = [[1,2], [3,4]];
    component.addMarkersViaUrl(params_markers_position);
    let position_of_map_markers = component.getMarkersPosition();
    expect(position_of_map_markers).toEqual(params_markers_position);
  });

  it('removeMarkersViaUrl: addMarkersViaUrl: should get positions array from map. for each position remvoe marker if not exists on params', ()=>{
    component.addIcon([1,2]);
    component.addIcon([3,4]);

    let position_of_map_markers = component.getMarkersPosition(); // [[1,2],[3,4]]
    expect(component.getMarkersPosition()).toEqual([[1,2],[3,4]]);

    component.currentParams = {markers: '(1,2)'}; // (3,4) should be removed
    component.removeMarkersViaUrl(position_of_map_markers);

    expect(component.getMarkersPosition()).toEqual([[1,2]]);
  });

  it('markerExistOnMap: should get one position and return if there is marker on map with that position', ()=>{
    component.addIcon([1,2]);
    expect(component.markerExistOnMap([1,2])).toBeTruthy();
    expect(component.markerExistOnMap([3,4])).toBeFalsy();
  });


  it('markerExistOnParams: should get one position and return if there is marker on params with that position', ()=>{
    component.currentParams = {
      markers: '(1,2),(3,4)'
    };
    expect(component.markerExistOnParams([1,2])).toBeTruthy();
    expect(component.markerExistOnParams([3,4])).toBeTruthy();
    expect(component.markerExistOnParams([5,6])).toBeFalsy();
  });
  // getBounds():[number, number, number, number] {
  //   let current_rotation:number = this.map.getView().getRotation();
  //   this.map.getView().setRotation(0);
  //   let bounds:ol.Extent = this.map.getView().calculateExtent(this.map.getSize());
  //   this.map.getView().setRotation(current_rotation);
  //   let t_bounds:ol.Extent = ol.proj.transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');
  //   let saved_bounds:[number, number, number, number] = t_bounds;
  //   return saved_bounds;
  // }


  it('setTmsLayers: should call addBaseLayer when tms_array empty, else call addTmsLayersViaUrl and removeTmsLayersViaUrl', ()=>{
    let params:Params = {};
    let fake_parmas_tms_array:Array<Object> = [];
    let fake_map_tms_array:Array<string> = [];

    spyOn(queryParamsHelperService, 'queryTms').and.callFake(() => fake_parmas_tms_array);
    spyOn(component, 'getMapTmsUrls').and.callFake(() => fake_map_tms_array);

    spyOn(component, 'addBaseLayer');
    spyOn(component, 'addTmsLayersViaUrl');
    spyOn(component, 'removeTmsLayersViaUrl');
    component.setTmsLayers(params);
    expect(component.addBaseLayer).toHaveBeenCalled();
    expect(component.addTmsLayersViaUrl).not.toHaveBeenCalled();
    expect(component.removeTmsLayersViaUrl).not.toHaveBeenCalled();
    fake_parmas_tms_array = [{url:'tms1'}, {url:'tms2'}];
    fake_map_tms_array = ['mapurl1','mapurl2'];
    component.setTmsLayers(params);
    expect(component.addTmsLayersViaUrl).toHaveBeenCalledWith(fake_parmas_tms_array);
    expect(component.removeTmsLayersViaUrl).toHaveBeenCalledWith(fake_map_tms_array);
  });


  it('addTmsLayersViaUrl should loop on params_tms_array and add layer if layer not exist on map', ()=>{
    let params_tms_array = ['tms_url1', 'tms_url2', 'tms_url3'];
    let tmsUrlExistOnMapRes:boolean = true;

    spyOn(component, 'tmsUrlExistOnMap').and.callFake(() => tmsUrlExistOnMapRes);
    spyOn(component.map, 'addLayer');


    component.addTmsLayersViaUrl(params_tms_array);
    expect(component.map.addLayer).toHaveBeenCalledTimes(0);

    tmsUrlExistOnMapRes = false;
    component.addTmsLayersViaUrl(params_tms_array);
    expect(component.map.addLayer).toHaveBeenCalledTimes(3);
  });

  it('removeTmsLayersViaUrl should loop on map_tms_array and remove layer that not exist on params and call addBaseLayer if no noTileLayer eq "true"', ()=>{
    let map_tms_array = ['tms_url1', 'tms_url2', 'tms_url3'];
    let map_layers_array = [{jc: 'tms_url1'}, {jc: 'tms_url2'}, {jc:'tms_url3'}];

    let tmsUrlExistOnParamsRes:boolean = true;
    let noTileLayerRes:boolean = false;

    spyOn(component, 'addBaseLayer');
    spyOn(component, 'noTileLayer').and.callFake(() => noTileLayerRes);
    spyOn(component, 'tmsUrlExistOnParams').and.callFake(() => tmsUrlExistOnParamsRes);
    spyOn(component.map, 'removeLayer');
    spyOn(component,'getMapXYZLayers').and.callFake(()=> map_layers_array);

    component.removeTmsLayersViaUrl(map_tms_array);
    expect(component.map.removeLayer).not.toHaveBeenCalled();
    expect(component.addBaseLayer).not.toHaveBeenCalled();

    tmsUrlExistOnParamsRes = false;
    noTileLayerRes = true;

    component.removeTmsLayersViaUrl(map_tms_array);
    expect(component.map.removeLayer).toHaveBeenCalledTimes(3);
    expect(component.addBaseLayer).toHaveBeenCalled();

  });

  it('tmsUrlExistOnMap should get _url and return if one of map urls equal to _url' , ()=>{
    spyOn(component, 'getMapTmsUrls').and.callFake(() => ["url1", "url2", "url3"]);
    expect(component.tmsUrlExistOnMap("url1")).toBeTruthy();
    expect(component.tmsUrlExistOnMap("url2")).toBeTruthy();
    expect(component.tmsUrlExistOnMap("url3")).toBeTruthy();
    expect(component.tmsUrlExistOnMap("url4")).toBeFalsy();
  });
  it('tmsUrlExistOnParams should get _url and return if one of params urls equal to _url' , ()=>{
    spyOn(queryParamsHelperService, 'queryTms').and.callFake(() => ["url4", "url5", "url6"]);
    expect(component.tmsUrlExistOnParams("url4")).toBeTruthy();
    expect(component.tmsUrlExistOnParams("url5")).toBeTruthy();
    expect(component.tmsUrlExistOnParams("url6")).toBeTruthy();
    expect(component.tmsUrlExistOnParams("url7")).toBeFalsy();
  })


});
