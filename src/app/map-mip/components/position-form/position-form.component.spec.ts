/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {PositionFormComponent} from './position-form.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {QueryParamsHelperService} from "../../services/query-params-helper.service";
import {Permissions} from "./permissions.enum";
import {PositionFormModule} from "./position-form.module";
import {CalcService} from "../../services/calc-service";
import {
  ModalDirective, BsDropdownModule, ComponentLoaderFactory, PositioningService, TooltipConfig,
  PopoverConfig
} from "ng2-bootstrap";
import {HttpModule} from "@angular/http";
import {AjaxService} from "../../services/ajax.service";
import {Observable} from "rxjs";
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MapSizeComponent} from "./map-size/map-size.component";
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import {MarkersComponent} from "./markers/markers.component";
import {TerrainComponent} from "./terrain/terrain.component";

export let fake_Ajax_Service = {
  getLayerExam():Observable<any>{
    return Observable.of([{name:"exap1"}, {name:"exap2"}]);
  },
  getTerrainsExam():Observable<any>{
    return Observable.of([{name:"tr_exap1"}, {name:"tr_exap2"}]);
  }
};

@Component({
  selector: 'app-map-position',
  template: `<h1>שלום לך</h1>`,
  inputs:["position", "size"],
  outputs:["positionChange", "submitPositionEmitter"]
})
class MockMapPositionComponent {}

@Component({
  selector: 'app-layers',
  template: `<h1>2שלום לך</h1>`,
  inputs: ["layersString"],
  outputs:["submitLayersEmitter"]
})
class LayersMock{}

@Component({
  selector: 'app-markers',
  template: `<h1>2שלום לך</h1>`,
  inputs: ["lat", "lng"],
  outputs:["submitMarkersEmitter"]
})
class MarkersMock{}


@Component({
  selector: 'app-map-size',
  template: `<h1>2שלום לך</h1>`,
  inputs: ["size"],
  outputs:["sizeChange","submitSizeEmitter"]
})
class MapSizeMock{}


describe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let fixture: ComponentFixture<PositionFormComponent>;
  let element: any;
  let router:Router;
  let current_state:string = '/cesium';
  let queryParamsHelperService:QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        PositionFormModule,
        RouterTestingModule,
        HttpModule
      ],
      providers:[QueryParamsHelperService,CalcService, {provide: AjaxService, useValue: fake_Ajax_Service},BsDropdownModule,ComponentLoaderFactory,PositioningService,TooltipConfig,PopoverConfig]
    });

    TestBed.overrideModule(PositionFormModule, {
      set: {
        declarations: [PositionFormComponent, MarkersMock, ColorPickerComponent, MockMapPositionComponent,TerrainComponent, LayersMock, MapSizeMock]
      }
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([Router, QueryParamsHelperService], (_router:Router, _queryParamsHelperService:QueryParamsHelperService) => {
    fixture = TestBed.createComponent(PositionFormComponent);
    component = fixture.componentInstance;
    element   = fixture.nativeElement;
    fixture.detectChanges();
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;

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

  xit('should show all params that include permission of current_state value', () => {

    current_state = '/leaflet'; //lat,lng,zoom have permissions.

    component.params["lat"].val = 30;
    component.params["lng"].val = 20;
    component.params["zoom"].val = 10;

    fixture.detectChanges();

    let form_groups = element.querySelectorAll('.input-group');

    expect(form_groups.length).toEqual(3);

    let lng = form_groups[0];
    let lat = form_groups[1];
    let zoom = form_groups[2];

    expect(lat.querySelector("span").textContent).toEqual("lat");
    expect(lng.querySelector("span").textContent).toEqual("lng");
    expect(zoom.querySelector("span").textContent).toEqual("zoom");
    expect(+lat.querySelector("input").attributes['ng-reflect-model'].value).toEqual(30);
    expect(+lng.querySelector("input").attributes['ng-reflect-model'].value).toEqual(20);
    expect(+zoom.querySelector("input").attributes['ng-reflect-model'].value).toEqual(10);
  });


  it('submitMarkers should: put the correct value on markers, call submitForm and hide modal if need', async(() => {

      let mockModal = <any>{hide: () => undefined};
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

    }
  ));


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
    component.params.mode3d.val = true;
    component.params.rotate.val = false;
    component.params.markers.val = '(1,2,3)';
    component.params.layers.val = "(url: 'url_tms')";
    component.params.size.val = "10,10";
    component.params.position.val = "40,20";
    component.params.terrain.val = "terrainUrl";

    component.submitForm();

    let queryParams = {
      lng:1,
      lat:2,
      zoom:undefined,//no permission on cesium
      heading:6,
      pitch:4,
      roll:5,
      height:3,
      mode3d:undefined, //undefined when default (1)
      rotate: undefined,//undefined when default (0)
      markers: '(1,2,3)',
      layers: "(url: 'url_tms')",
      size: "10,10",
      position: "40,20",
      terrain: "terrainUrl"
    };
    expect(router.navigate).toHaveBeenCalledWith([], {queryParams: queryParams});

    component.params.markers.val = '(1,2,3),(4,5)';
    component.params.mode3d.val = false;
    component.params.rotate.val = true;

    queryParams.markers =  '(1,2,3),(4,5)';
    queryParams.mode3d =  0;
    queryParams.rotate =  1;

    component.submitForm();
    expect(router.navigate).toHaveBeenCalledWith([], {queryParams: queryParams});
  });

});
