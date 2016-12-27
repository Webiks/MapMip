/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {PositionFormComponent, PERMISSIONS} from './position-form.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CommonModule} from "@angular/common";

describe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let fixture: ComponentFixture<PositionFormComponent>;
  let element: any;
  let router:Router;
  let current_state:string = '/cesium';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations:[PositionFormComponent],
      imports:[
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      providers:[QueryParamsHelperService]
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
      permissions: [PERMISSIONS['/cesium']]
    };

    let zoom = {
      permissions: [PERMISSIONS['/leaflet']]
    };

    let lat = {
      permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet']]
    };

    let rotate = {
      permissions: [PERMISSIONS['/openlayers'], PERMISSIONS['/cesium?dim=2']]
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

    current_state = '/cesium?dim=2';

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
    component.params.rotate.val = 1;
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
      dim:3,
      rotate: 1,
      markers: '(1,2,3)'
    };


    expect(router.navigate).toHaveBeenCalledWith([], {queryParams: queryParams});
 });

});
