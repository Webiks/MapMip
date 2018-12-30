import { LeafletComponent } from '../leaflet.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from '../../../position-form/position-form.service';
import { Params, Router } from '@angular/router';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletMarkers } from './leaflet.component.markers';
import * as L from 'leaflet';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { config } from '../../../../../config/config';

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


  describe('markers', () => {
    let markers: LeafletMarkers;

    beforeEach(() => {
      markers = component.markers;
    });

    it('queryParams: setMarkersChanges: should have been call only when both params_changes and map_changes are "true" ', () => {
      let params_changes = true;
      let map_changes = true;

      spyOn(markers, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(markers, 'setMarkersChanges');

      let params: Params = {
        lat: '1.123',
        lng: '4.567',
        zoom: '5',
        markers: '(1,2,3),(4,5,6)'
      };

      params_changes = true;
      map_changes = false;
      markers.queryParams(params);
      expect(markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = false;
      map_changes = true;
      markers.queryParams(params);
      expect(markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = true;
      map_changes = true;
      markers.queryParams(params);
      expect(markers.setMarkersChanges).toHaveBeenCalledWith(params);

    });

    it('destroy', () => {
      spyOn(markers.queryParamsSubscriber, 'unsubscribe');
      markers.destroy();
      expect(markers.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', () => {
      let params = {};
      let params_markers = [{ position: [30, 20], color: 'green' }, { position: [60, 50] }];
      let map_markers = [{ position: [30, 20], color: 'green' }, {
        position: [60, 50],
        color: config.defaultMarker.icon
      }];
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      expect(markers.anyMarkersMapChanges(params)).toBeFalsy();
      params_markers[1].icon = 'red';
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();
    });

    it('destroy', () => {
      spyOn(markers.queryParamsSubscriber, 'unsubscribe');
      markers.destroy();
      expect(markers.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('getMarkersPosition should return positions array ( {position,color}, {position,color},...)', () => {
      let marker_a = { position: [20, 30], color: 'red' };
      let marker_b = { position: [40, 50] };
      markers.getBaseMarker(marker_a).addTo(component.map);
      markers.getBaseMarker(marker_b).addTo(component.map);
      expect(markers.getMarkersPosition().length).toEqual(2);
      expect(markers.getMarkersPosition()[0]).toEqual({ position: [20, 30], color: 'red' });
      expect(markers.getMarkersPosition()[1]).toEqual({ position: [40, 50], color: config.defaultMarker.icon });
    });

    it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', () => {
      let params_markers = [{ position: [30, 20], color: 'green' }, { position: [60, 50] }];
      let map_markers = [{ position: [30, 20], color: 'green' }, {
        position: [60, 50],
        color: config.defaultMarker.icon
      }];
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      spyOn(markers, 'addMarkersViaUrl');
      spyOn(markers, 'removeMarkersViaUrl');
      markers.setMarkersChanges({});
      expect(markers.addMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
      expect(markers.removeMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
    });

    it('addMarkersViaUrl: should get {positions,color} array from params. for each {positions,color} create marker if not exists on map', () => {
      let fake_marker = {
        addTo: () => {
        }
      };
      spyOn(fake_marker, 'addTo');
      spyOn(markers, 'getBaseMarker').and.callFake(() => fake_marker);
      let params_markers = [{ position: [30, 20], color: 'green' }, { position: [60, 50], color: 'red' }];
      let map_markers = [{ position: [30, 20], color: 'green' }];
      markers.addMarkersViaUrl(params_markers, map_markers);
      expect(markers.getBaseMarker).toHaveBeenCalledWith({ position: [60, 50], color: 'red' });
      expect(markers.getBaseMarker).toHaveBeenCalledTimes(1);
      expect(fake_marker.addTo).toHaveBeenCalledTimes(1);
    });

    it('removeMarkersViaUrl: should get {positions,color} array from map. for each {position,color} remove marker if not exists on params', () => {
      let not_exist_marker = { position: [60, 50], color: 'red' };
      spyOn(component.map, 'removeLayer');
      spyOn(markers, 'getMarkerViaMarkerObj').and.callFake(marker => marker);
      let params_markers = [{ position: [30, 20], color: 'green' }];
      let map_markers = [{ position: [30, 20], color: 'green' }, not_exist_marker];
      markers.removeMarkersViaUrl(params_markers, map_markers);

      expect(markers.getMarkerViaMarkerObj).toHaveBeenCalledTimes(1);
      expect(component.map.removeLayer).toHaveBeenCalledWith(not_exist_marker);
      expect(component.map.removeLayer).toHaveBeenCalledTimes(1);
    });

    it('markerExistOnMap: should get one {position,color} and return if there is marker on map with that {position,color}', () => {
      let existMarkerObj = { position: [60, 50] };
      let notExistMarkerObj = { position: [60, 50], color: 'red' };
      let map_markers = [{ position: [60, 50], color: config.defaultMarker.icon }];
      expect(markers.markerExistOnMap(map_markers, existMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnMap(map_markers, notExistMarkerObj)).toBeFalsy();
    });

    it('markerExistOnParams: should get one position and return if there is marker on params with that position', () => {
      let existMarkerObj = { position: [60, 50], color: config.defaultMarker.icon };
      let notExistMarkerObj = { position: [60, 50], color: 'red' };
      let params_markers = [{ position: [60, 50] }];
      expect(markers.markerExistOnParams(params_markers, existMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnParams(params_markers, notExistMarkerObj)).toBeFalsy();
    });


    it('toggleMarkerPicker should get checked variable and invoke different functions accordingly', () => {
      spyOn(component.map, 'on');
      spyOn(component.map, 'off');

      markers.toggleMarkerPicker(true);
      expect(component.map.on).toHaveBeenCalled();
      markers.toggleMarkerPicker(false);
      expect(component.map.off).toHaveBeenCalledWith('click');
    });

    it('leftClickInputAction should get event with latlng, and call addMarker with latlng', () => {
      spyOn(queryParamsHelperService, 'addMarker');
      spyOn(component.map, 'layerPointToLatLng').and.callFake(() => L.latLng([20, 20]));

      let event: { layerPoint: L.Point } = <any>{ layerPoint: L.point(30, 30) };
      positionFormService.selectedColorIndex = positionFormService.getSelectedColorIndex('black');
      markers.leftClickInputAction(event);
      expect(queryParamsHelperService.addMarker).toHaveBeenCalledWith({ position: [20, 20], color: 'black' });
    });

  });
});
