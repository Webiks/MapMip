import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormComponent } from './position-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { QueryParamsHelperService } from '../services/query-params-helper.service';
import { CalcService } from '../services/calc-service';
import { ModalDirective, TooltipModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { AjaxService } from '../services/ajax.service';
import { Observable } from 'rxjs';
import { MapMipService } from '../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from '../../utils/mock-component';
import { FlipSwitchComponent } from './flip-switch/flip-switch.component';
import { MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { PositionFormService } from './position-form.service';
import { Permissions } from './permissions.enum';

export let fake_Ajax_Service = {
  getLayerExam(): Observable<any> {
    return Observable.of([{ name: 'exap1' }, { name: 'exap2' }]);
  },
  getTerrainsExam(): Observable<any> {
    return Observable.of([{ name: 'tr_exap1' }, { name: 'tr_exap2' }]);
  },
  getGeoJsonExam(): Observable<any> {
    return Observable.of({});
  }
};

const MockComponents = [
  MockComponent({
    selector: 'app-map-position',
    inputs: ['position', 'size'],
    outputs: ['positionChange', 'submitPositionEmitter']
  }),
  MockComponent({
    selector: 'app-layers',
    inputs: ['layersString'],
    outputs: ['submitLayersEmitter']
  }),
  MockComponent({
    selector: 'app-markers',
    inputs: ['lat', 'lng'],
    outputs: ['submitMarkersEmitter']
  }),
  MockComponent({
    selector: 'app-map-size',
    inputs: ['size'],
    outputs: ['sizeChange', 'submitSizeEmitter']
  }),
  MockComponent({
    selector: 'app-polygons',
    inputs: ['polygons'],
    outputs: ['togglePickedEmitter', 'submitPolygonsEmitter']
  }),
  MockComponent({
    selector: 'app-geojson-layer',
    inputs: ['geojson'],
    outputs: ['submitGeoJsonEmitter', 'submitPolygonsEmitter']
  }),
  MockComponent({
    selector: 'app-map-lighting',
    inputs: ['lighting']
  }),
  MockComponent({
    selector: 'app-terrain',
    inputs: ['lighting', 'terrain'],
    outputs: ['submitTerrainEmitter', 'terrainChange']
  })
];

describe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let fixture: ComponentFixture<PositionFormComponent>;
  let element: any;
  let current_state = '/cesium';
  let queryParamsHelperService: QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        FormsModule,
        RouterTestingModule,
        TooltipModule.forRoot(),
        HttpModule
      ],
      declarations: [FlipSwitchComponent, PositionFormComponent, ...MockComponents],
      providers: [
        PositionFormService,
        QueryParamsHelperService,
        MapMipService,
        CalcService, {
          provide: AjaxService,
          useValue: fake_Ajax_Service
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(PositionFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    spyOn(component, 'havePermission').and.returnValue(true);
    fixture.detectChanges();
    queryParamsHelperService = _queryParamsHelperService;


    spyOn(component.mapMipService, 'isActive').and.callFake((url) => {
      return current_state.includes(url);
    });

    component.mapMipService['__defineGetter__']('url', () => current_state);

  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  xit('should havePermission to return if param should include on current state', () => {

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

    current_state = '/leaflet'; // lat,lng,zoom have permissions.

    component.params['lat'].val = 30;
    component.params['lng'].val = 20;
    component.params['zoom'].val = 10;

    fixture.detectChanges();

    let form_groups = element.querySelectorAll('.input-group');

    expect(form_groups.length).toEqual(3);

    let lng = form_groups[0];
    let lat = form_groups[1];
    let zoom = form_groups[2];

    expect(lat.querySelector('span').textContent).toEqual('lat');
    expect(lng.querySelector('span').textContent).toEqual('lng');
    expect(zoom.querySelector('span').textContent).toEqual('zoom');
    expect(+lat.querySelector('input').attributes['ng-reflect-model'].value).toEqual(30);
    expect(+lng.querySelector('input').attributes['ng-reflect-model'].value).toEqual(20);
    expect(+zoom.querySelector('input').attributes['ng-reflect-model'].value).toEqual(10);
  });

  it('submitMarkers should: put the correct value on markers, call submitForm and hide modal if need', async(() => {

    let mockModal = <any>{ hide: () => undefined };
    let $event: { hide: boolean, smModal: ModalDirective, parsed_markers: string } = {
      hide: false,
      smModal: mockModal,
      parsed_markers: '(1,2,3),(4,5,6)'
    };
    spyOn(component, 'submitForm').and.callFake(() => {
      return {
        then(callback: () => void) {
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
    spyOn(component.mapMipService, 'navigate');

    current_state = '/cesium';

    // cesium params
    component.params.lng.val = 1;
    component.params.lat.val = 2;
    component.params.height.val = 3;
    component.params.pitch.val = 4;
    component.params.roll.val = 5;
    component.params.heading.val = 6;
    component.params.mode3d.val = true;
    component.params.rotate.val = false;
    component.params.markers.val = '(1,2,3)';
    component.params.layers.val = '(url: \'url_tms\')';
    component.params.size.val = '10,10';
    component.params.position.val = '40,20';
    component.params.terrain.val = 'terrainUrl';
    component.params.geojson.val = 'geojson';
    component.params.lighting.val = 'lighting';
    component.params.polygons.val = 'polygons';
    component.params.polyline.val = 'polyline';

    component.submitForm();

    let queryParams = {
      lng: 1,
      lat: 2,
      zoom: undefined, // no permission on cesium
      heading: 6,
      pitch: 4,
      roll: 5,
      height: 3,
      mode3d: undefined, // undefined when default (1)
      rotate: undefined, // undefined when default (0)
      markers: '(1,2,3)',
      layers: '(url: \'url_tms\')',
      size: '10,10',
      position: '40,20',
      terrain: 'terrainUrl',
      geojson: 'geojson',
      lighting: undefined,
      polygons: 'polygons',
      polyline: 'polyline'
    };

    expect(component.mapMipService.navigate).toHaveBeenCalledWith([], { queryParams });

    component.params.markers.val = '(1,2,3),(4,5)';
    component.params.mode3d.val = false;
    component.params.rotate.val = true;

    queryParams.markers = '(1,2,3),(4,5)';
    queryParams.mode3d = 0;
    queryParams.rotate = 1;

    component.submitForm();
    expect(component.mapMipService.navigate).toHaveBeenCalledWith([], { queryParams: queryParams });
  });

});
