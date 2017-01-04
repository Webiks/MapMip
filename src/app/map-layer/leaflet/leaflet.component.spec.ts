/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { LeafletComponent } from './leaflet.component';
import {RouterTestingModule} from "@angular/router/testing";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc-service";
import {Params, Router, NavigationExtras} from "@angular/router";

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
        RouterTestingModule
      ],
      declarations: [ LeafletComponent ],
      providers: [QueryParamsHelperService, CalcService]
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

    })
  });

  it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {
    spyOn(router, 'navigate');

    component.currentParams = {markers: '(1,2,3)'}

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
    let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng: 2, lat: 1, zoom: 10, markers: '(1,2,3)'});
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

  it("getLayersArray should return all layers in Array" , () => {
    let layars = [];
    component.map.eachLayer((lay)=>{layars.push(lay);});
    expect(component.getLayersArray()).toEqual(layars);
  });

  it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', ()=>{
    let params_markers = [1,2,3];
    let map_markers = [1,2,3,4]
    spyOn(component, 'getMarkersPosition').and.callFake(()=>params_markers);
    spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(()=>map_markers);
    expect(component.anyMarkersMapChanges({})).toBeTruthy();
    params_markers = [1,2,3,4,5];
    map_markers    = [1,2,3,4,5];
    expect(component.anyMarkersMapChanges({})).toBeFalsy();
  });

  it('getMarkersPosition should return positions array ( [lng, lat], [lng, lat],...)', ()=>{
    L.marker([20,30], {icon:icon_layer}).addTo(component.map);
    L.marker([40,50], {icon:icon_layer}).addTo(component.map);
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
    L.marker([2,1], {icon:icon_layer}).addTo(component.map);
    let marker_to_remove = L.marker([4,3], {icon:icon_layer});
    marker_to_remove.addTo(component.map);

    let position_of_map_markers = component.getMarkersPosition(); // [[1,2],[3,4]]
    expect(component.getMarkersPosition()).toEqual([[1,2],[3,4]]);

    component.currentParams = {markers: '(1,2)'}; // (3,4) should be removed
    component.removeMarkersViaUrl(position_of_map_markers);

    expect(component.getMarkersPosition()).toEqual([[1,2]]);
  });

  it('markerExistOnMap: should get one position and return if there is marker on map with that position', ()=>{
    L.marker([2,1], {icon:icon_layer}).addTo(component.map);
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
});
