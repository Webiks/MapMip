import { OpenlayersComponent } from '../openlayers.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from '../../../position-form/position-form.service';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { NavigationExtras, Params, Router } from '@angular/router';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenlayersMapView } from './openlayers.component.map-view';
import * as ol from 'openlayers';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from '../../context-menu/context-menu.module';

xdescribe('OpenlayersComponent', () => {
  let component: OpenlayersComponent;
  let fixture: ComponentFixture<OpenlayersComponent>;
  let calcService: CalcService;
  let router: Router;
  let queryParamsHelperService: QueryParamsHelperService;
  let positionFormService: PositionFormService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, ContextMenuModule, BrowserAnimationsModule],
      declarations: [OpenlayersComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));


  beforeEach(inject([CalcService, Router, QueryParamsHelperService, PositionFormService], (_calcService: CalcService, _router: Router, _queryParamsHelperService: QueryParamsHelperService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(OpenlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    calcService = _calcService;
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    positionFormService = _positionFormService;
  }));

  describe('map-view', () => {
    let map_view: OpenlayersMapView;

    beforeEach(() => {
      map_view = component.map_view;
    });

    describe('queryParams', () => {
      it('params with "bounds" should make setMapBounds to have been call', () => {
        spyOn(map_view, 'setMapBounds');
        let params: Params = {
          lat: '1.123',
          lng: '4.567',
          bounds: '1,2,3,4'
        };
        map_view.queryParams(params);
        expect(map_view.setMapBounds).toHaveBeenCalledWith(params);
      });

      it('params with no "bounds" should make setMapView to have been call, only when anyParamChanges return "true"', () => {
        let anyParamsChangesReturnValue = false;
        spyOn(map_view, 'setMapView');
        spyOn(map_view, 'anyParamChanges').and.callFake(() => anyParamsChangesReturnValue);

        let params: Params = {
          lat: '1.123',
          lng: '4.567'
        };
        map_view.queryParams(params);
        expect(map_view.setMapView).not.toHaveBeenCalledWith(params);
        anyParamsChangesReturnValue = true;
        map_view.queryParams(params);
        expect(map_view.setMapView).toHaveBeenCalledWith(params);
      });
    });

    it('setMapView should get params and use them to call map.setView with params values', () => {
      spyOn(component.map, 'setView');
      spyOn(ol, 'View').and.callFake(() => 'viewConstructor');
      spyOn(calcService, 'toRadians').and.returnValue(0);

      let params: Params = {
        lng: 1,
        lat: 2,
        zoom: 10
      };

      let viewObj = {
        center: ol.proj.fromLonLat([1, 2]),
        zoom: 10,
        rotation: 0
      };

      map_view.setMapView(params);
      expect(ol.View).toHaveBeenCalledWith(viewObj);
      expect(component.map.setView).toHaveBeenCalled();
    });


    // it('onLeave should check rotation and go_north value and animate to current rotation if need', () => {
    //   let observer: Observer<boolean> = <any>{
    //     next(bool: boolean): void {
    //     }
    //   };
    //   Observable.create((_observer: Observer<boolean>) => {
    //     observer = _observer;
    //   });
    //
    //   let rotataion = 0;
    //   map_view.go_north = true;
    //
    //   let view = component.map.getView();
    //   spyOn(observer, 'next');
    //   spyOn(view, 'animate');
    //   spyOn(view, 'getRotation').and.callFake(() => rotataion);
    //
    //   map_view.onLeave(observer);
    //   expect(observer.next).toHaveBeenCalledWith(true);
    //
    //   rotataion = 1;
    //   map_view.go_north = false;
    //
    //   map_view.onLeave(observer);
    //   expect(observer.next).toHaveBeenCalledWith(true);
    //   expect(observer.next).toHaveBeenCalledTimes(2);
    //
    //   rotataion = calcService.toRadians(179);
    //   map_view.go_north = true;
    //   map_view.onLeave(observer);
    //   expect(view.animate).toHaveBeenCalledWith({ rotation: 0, duration: 500 }, map_view.andRotation);
    //
    //   rotataion = calcService.toRadians(181);
    //   map_view.go_north = true;
    //   map_view.onLeave(observer);
    //   expect(view.animate).toHaveBeenCalledWith({
    //     rotation: Cesium.Math.toRadians(360),
    //     duration: 500
    //   }, map_view.andRotation);
    //
    // });

    // it('setQueryBoundsOnNavigationEnd: get url, parse url to UrlTree Object, add "bounds" to queryParams, parse back and navigate with new url', () => {
    //   spyOn(map_view, 'getBounds').and.returnValue([1, 2, 3, 4]);
    //   spyOn(router, 'navigateByUrl');
    //
    //   let event: NavigationEnd = <any> { url: '/cesium?lat=1&lng=2' };
    //   map_view.setQueryBoundsOnNavigationEnd(event);
    //
    //   expect(router.navigateByUrl).toHaveBeenCalledWith(`/cesium?lat=1&lng=2&bounds=${encodeURIComponent('1,2,3,4')}`);
    // });

    it('setMapBounds should get bounds and rotation from params and use them to call view.fit and view.setRotation', () => {
      let view = component.map.getView();
      spyOn(view, 'fit');
      spyOn(view, 'setRotation');

      let params: Params = {
        bounds: '1,2,3,4',
        heading: '270'
      };

      map_view.setMapBounds(params);
      expect(view.fit).toHaveBeenCalledWith(component.transformExtent([1, 2, 3, 4]), component.map.getSize());
      expect(view.setRotation).toHaveBeenCalledWith(calcService.toRadians(90));
    });


    it('anyParamChanges should get params and check if there\'s any changes between params and map', () => {
      let center = [1.11111111111111111, 2.222222222222222222];
      let zoom = 10;
      let heading = calcService.toRadians(90);

      let getCenter = () => center;
      let getZoom = () => zoom;
      let getRotation = () => heading;

      let params: Params = {
        lng: 1.11111111111111111111111111,
        lat: 2.22222222222222222222222222,
        zoom: 10,
        heading: '270'
      };

      let view = component.map.getView();
      spyOn(view, 'getCenter').and.callFake(getCenter);
      spyOn(view, 'getZoom').and.callFake(getZoom);
      spyOn(view, 'getRotation').and.callFake(getRotation);

      expect(map_view.anyParamChanges(params)).toBeFalsy();
      params['zoom'] = 12;
      expect(map_view.anyParamChanges(params)).toBeTruthy();
    });


    it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {
      spyOn(router, 'navigate');
      spyOn(ol.proj, 'transform').and.returnValue([2, 1]);
      component.currentParams = { markers: '(1,2,3)', layers: 'tms_strings', rotate: '0' };

      let event = {
        map: {
          getView: () => {
            return {
              getCenter: () => {
                return {
                  lat: 1,
                  lng: 2
                };
              },
              getZoom: () => 10,
              getRotation: () => 0
            };
          }
        }
      };

      map_view.moveEnd(event);
      let navigationExtras: NavigationExtras = queryParamsHelperService.getQuery({
        lng: 2,
        lat: 1,
        zoom: 10,
        heading: 0,
        markers: '(1,2,3)',
        layers: 'tms_strings',
        rotate: 0,
        position: undefined
      });
      expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);

      component.currentParams['rotate'] = '1';
      map_view.moveEnd(event);
      navigationExtras = queryParamsHelperService.getQuery({
        lng: 2,
        lat: 1,
        zoom: 10,
        heading: 0,
        markers: '(1,2,3)',
        layers: 'tms_strings',
        rotate: undefined,
        position: undefined
      });
      expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);
    });

    it('transformExtent should can extent on EPSG:4326 projection and transform extent to EPSG ', () => {
      spyOn(ol.proj, 'transformExtent');
      component.transformExtent([1, 2, 3, 4]);
      expect(ol.proj.transformExtent).toHaveBeenCalledWith([1, 2, 3, 4], 'EPSG:4326', 'EPSG:3857');
    });

    it('getBounds: should initialize rotation to zero, get bounds from map, transform them to EPSG:4326 , return them as [number, number, number, number] and set rotation to saved rotation', () => {
      let rotation_radian = calcService.toRadians(0);
      component.map.getView().setRotation(rotation_radian);
      // let view = component.map.getView();
      // spyOn(view, 'calculateExtent').and.returnValue(ol.proj.transformExtent([1,2,3,4], 'EPSG:4326', 'EPSG:3857'));
      let bounds_with_rotation_0 = map_view.getBounds();
      rotation_radian = calcService.toRadians(90);
      component.map.getView().setRotation(rotation_radian);
      let bounds_with_rotation_90 = map_view.getBounds();

      expect(bounds_with_rotation_0).toEqual(bounds_with_rotation_90);
    });


  });
});
