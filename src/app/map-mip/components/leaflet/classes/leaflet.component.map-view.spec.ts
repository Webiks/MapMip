import { LeafletComponent } from '../leaflet.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from '../../../position-form/position-form.service';
import { NavigationExtras, Params, Router } from '@angular/router';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletMapView } from './leaflet.component.map-view';
import * as L from 'leaflet';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let router: Router;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpModule
      ],
      declarations: [LeafletComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));


  beforeEach(inject([QueryParamsHelperService, Router, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _router: Router, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    router = _router;
    positionFormService = _positionFormService;
    fixture.detectChanges();
  }));

  describe('map-view', () => {
    let map_view: LeafletMapView;

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

      it('destroy', () => {
        spyOn(map_view.queryParamsSubscriber, 'unsubscribe');
        map_view.destroy();
        expect(map_view.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
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

    it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams and should call router.navigate only when anyParamChanges=true', () => {
      let anyParamChangesRes = false;
      spyOn(component.mapMipService, 'navigate');
      spyOn(map_view, 'anyParamChanges').and.callFake(() => anyParamChangesRes);

      component.currentParams = { markers: '(1,2,3)' };

      let event = {
        target: {
          getCenter: () => {
            return {
              lat: 1,
              lng: 2
            };
          },
          getZoom: () => 10
        }
      };

      map_view.moveEnd(event);
      let navigationExtras: NavigationExtras = queryParamsHelperService.getQuery({
        lng: 2,
        lat: 1,
        zoom: 10,
        markers: '(1,2,3)',
        layers: undefined
      });
      expect(component.mapMipService.navigate).not.toHaveBeenCalledWith([], navigationExtras);

      anyParamChangesRes = true;
      map_view.moveEnd(event);
      expect(component.mapMipService.navigate).toHaveBeenCalledWith([], navigationExtras);
    });

    it('setMapView should get params and use them to call map.setView with params values', () => {
      spyOn(component.map, 'setView');
      let params: Params = {
        lng: 1,
        lat: 2,
        zoom: 10
      };
      map_view.setMapView(params);
      expect(component.map.setView).toHaveBeenCalledWith([2, 1], 10);
    });

    it('setMapBounds should get params and use them to call map.fitBounds', () => {
      spyOn(component.map, 'fitBounds');

      let params: Params = {
        bounds: '1,2,3,4'
      };

      map_view.setMapBounds(params);
      expect(component.map.fitBounds).toHaveBeenCalledWith([[2, 1], [4, 3]], null);
    });

    it('anyParamChanges should get params and check if there\'s any changes between params and map', () => {
      let getCenter = () => {
        return { lng: 1.11111111111, lat: 2.2222222222 };
      };
      let getZoom = () => 10;
      let params: Params = {
        lng: 1.11111111111111111111111111,
        lat: 2.22222222222222222222222222,
        zoom: 10
      };
      spyOn(component.map, 'getCenter').and.callFake(getCenter);
      spyOn(component.map, 'getZoom').and.callFake(getZoom);
      expect(map_view.anyParamChanges(params)).toBeFalsy();
      params['zoom'] = 12;
      expect(map_view.anyParamChanges(params)).toBeTruthy();
    });

    it('getBounds should get bounds(L.LatLngBounds) from map and return the bounds as [number,number,number,number]', () => {
      let latlngBounds: L.LatLngBounds = L.latLngBounds([[1, 2], [3, 4]]);
      spyOn(component.map, 'getBounds').and.returnValue(latlngBounds);
      let boundsRes: [number, number, number, number] = map_view.getBounds();
      expect(boundsRes).toEqual([2, 3, 4, 1]);
    });

  });

});
