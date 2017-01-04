/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import {PositionFormComponent} from './position-form.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {Permissions} from "./permissions.enum";
import {PositionFormModule} from "./position-form.module";
import {CalcService} from "../calc-service";
import {ModalDirective} from "ng2-bootstrap";

describe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let fixture: ComponentFixture<PositionFormComponent>;
  let element: any;
  let router:Router;
  let current_state:string = '/cesium';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        PositionFormModule,
        RouterTestingModule
      ],
      providers:[QueryParamsHelperService,CalcService]
    })
    .compileComponents();
  }));

  beforeEach(inject([Router], (_router:Router) => {
    fixture = TestBed.createComponent(PositionFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    router = _router;

    spyOn(router, 'isActive').and.callFake((url) => {
      return current_state.includes(url)
    });

    router['__defineGetter__']('url', () => current_state)

  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should keys return all Object keys', () => {
    let test_obj = {one:null,two:null,three:null};
    let keys:Array<string> = component.keys(test_obj);
    expect(keys).toBeDefined();
    expect(keys.length).toEqual(3);
    expect(keys[0]).toEqual('one');
    expect(keys[1]).toEqual('two');
    expect(keys[2]).toEqual('three');
  });

  it('should havePermission to return if param should include on current state', () => {



    fixture.detectChanges();

    let height = {
      permissions: [Permissions['/cesium']]
    };

    let zoom = {
      permissions: [Permissions['/leaflet']]
    };

    let lat = {
      permissions: [Permissions['/cesium'], Permissions['/leaflet']]
    };

    let rotate = {
      permissions: [Permissions['/openlayers'], Permissions['/cesium?mode3d=0']]
    };


    current_state = '/cesium';

    expect(component.havePermission(height)).toBeTruthy();
    expect(component.havePermission(zoom)).toBeFalsy();
    expect(component.havePermission(lat)).toBeTruthy();
    expect(component.havePermission(rotate)).toBeFalsy();

    current_state = '/leaflet';

    expect(component.havePermission(height)).toBeFalsy();
    expect(component.havePermission(zoom)).toBeTruthy();
    expect(component.havePermission(lat)).toBeTruthy();
    expect(component.havePermission(rotate)).toBeFalsy();

    current_state = '/openlayers';

    expect(component.havePermission(height)).toBeFalsy();
    expect(component.havePermission(zoom)).toBeFalsy();
    expect(component.havePermission(lat)).toBeFalsy();
    expect(component.havePermission(rotate)).toBeTruthy();

    current_state = '/cesium?mode3d=0';

    expect(component.havePermission(height)).toBeTruthy();
    expect(component.havePermission(zoom)).toBeFalsy();
    expect(component.havePermission(lat)).toBeTruthy();
    expect(component.havePermission(rotate)).toBeTruthy();

  });

  it('should show all params that include permission of current_state value', () => {

    current_state = '/leaflet'; //lat,lng,zoom have permissions.

    component.params["lat"].val = 30;
    component.params["lng"].val = 20;
    component.params["zoom"].val = 10;

    fixture.detectChanges();

    let form_groups = element.querySelectorAll('.input-group');

    expect(form_groups.length).toEqual(3);

    let lat = form_groups[0];
    let lng = form_groups[1];
    let zoom = form_groups[2];

    expect(lat.querySelector("span").textContent).toEqual("lat");
    expect(lng.querySelector("span").textContent).toEqual("lng");
    expect(zoom.querySelector("span").textContent).toEqual("zoom");
    expect(+lat.querySelector("input").attributes['ng-reflect-model'].value).toEqual(30);
    expect(+lng.querySelector("input").attributes['ng-reflect-model'].value).toEqual(20);
    expect(+zoom.querySelector("input").attributes['ng-reflect-model'].value).toEqual(10);
  });

  it('markerCenter should create marker with the of the current center lng,lat ', () => {
    spyOn(router, 'navigateByUrl');
    current_state = '/leaflet?lng=2&lat=1';
    component.markerCenter();
    let markers:string = encodeURIComponent("(2,1)");
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/leaflet?lng=2&lat=1&markers=${markers}`);

    current_state = '/leaflet?lng=7&lat=8&markers=(1,2,3),(4,5,6)';
    component.markerCenter();
    markers = encodeURIComponent("(1,2,3),(4,5,6),(7,8)");
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/leaflet?lng=7&lat=8&markers=${markers}`);
  });


  it('submitMarkers should: put the correct value on markers, call submitForm and hide modal if need', async(() => {

    let mockModal = new ModalDirective(null,null,null);
    let $event: {hide:boolean, smModal:ModalDirective, parsed_markers:string} = {hide:false, smModal: mockModal, parsed_markers:'(1,2,3),(4,5,6)'}
    spyOn(component,'submitForm').and.callFake( () => {
      return{
        then(callback:() => void) {
          callback();
        }
      };
    });
    spyOn($event.smModal, 'hide');

    component.submitMarkers($event);
    // fixture.whenStable().then(()=>{
    //
    // });
    expect(component.params.markers.val).toEqual('(1,2,3),(4,5,6)');
    expect($event.smModal.hide).not.toHaveBeenCalled();

    $event.hide = true;

    component.submitMarkers($event);
    expect(component.params.markers.val).toEqual('(1,2,3),(4,5,6)');
    expect($event.smModal.hide).toHaveBeenCalled();

}));


  it('submitForm should navigate with the new params values', () => {
    spyOn(router, 'navigate');

    current_state = '/cesium';

    //cesium params
    component.params.lng.val = 1;
    component.params.lat.val = 2;
    component.params.height.val = 3;
    component.params.pitch.val = 4;
    component.params.roll.val = 5;
    component.params.heading.val = 6;
    component.params.mode3d.val = 1;
    component.params.rotate.val = 0;
    component.params.markers.val = '(1,2,3)';


    component.submitForm();
    fixture.detectChanges();

    let queryParams = {
      lng:1,
      lat:2,
      height:3,
      pitch:4,
      roll:5,
      heading:6,
      zoom:undefined, //no permission on cesium
      mode3d:undefined, //undefined when default (1)
      rotate: undefined,//undefined when default (1)
      markers: '(1,2,3)'
    };
    expect(router.navigate).toHaveBeenCalledWith([], {queryParams: queryParams});
 });

});
