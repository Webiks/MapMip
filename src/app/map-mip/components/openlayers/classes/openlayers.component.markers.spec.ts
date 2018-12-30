import { OpenlayersComponent } from '../openlayers.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from '../../../position-form/position-form.service';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { Router } from '@angular/router';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenlayersMarkers } from './openlayers.component.markers';
import * as ol from 'openlayers';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { config } from '../../../../../config/config';

describe('OpenlayersComponent', () => {
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

  describe('markers', () => {
    let markers: OpenlayersMarkers;

    beforeEach(() => {
      markers = component.markers;
    });


    // it('queryParams: setMarkersChanges: should have been call only when both params_changes and map_changes are "true" ', () => {
    //   let params_changes = true;
    //   let map_changes = true;
    //   spyOn(markers, 'anyMarkersMapChanges').and.callFake(() => map_changes);
    //   spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
    //   spyOn(markers, 'setMarkersChanges');
    //
    //   let params: Params = {
    //     lat: '1.123',
    //     lng: '4.567',
    //     zoom: '5',
    //     markers: '(1,2,3),(4,5,6)'
    //   };
    //
    //   params_changes = true;
    //   map_changes = false;
    //   markers.queryParams(params);
    //   expect(markers.setMarkersChanges).not.toHaveBeenCalledWith(params);
    //
    //   params_changes = false;
    //   map_changes = true;
    //   markers.queryParams(params);
    //   expect(markers.setMarkersChanges).not.toHaveBeenCalledWith(params);
    //
    //   params_changes = true;
    //   map_changes = true;
    //   markers.queryParams(params);
    //   expect(markers.setMarkersChanges).toHaveBeenCalledWith(params);
    //
    // });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', () => {
      let params = {};
      let params_markers: any = [{ position: [30, 20], icon: 'green' }, { position: [60, 50] }];
      let map_markers = [{ position: [30, 20], icon: 'green' }, {
        position: [60, 50],
        color: config.defaultMarker.icon
      }];
      spyOn(queryParamsHelperService, 'queryMarkersNoHeight').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      expect(markers.anyMarkersMapChanges(params)).toBeFalsy();
      params_markers[1].icon = 'red';
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();
    });


    it('getMarkersPosition should return positions array ( {position,color}, {position,color},...)', () => {
      let marker_a = { position: [20, 30], color: 'red' };
      let marker_b = { position: [40, 50] };
      markers.addIcon(marker_a);
      markers.addIcon(marker_b);
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
      spyOn(markers, 'addIcon');
      let params_markers = [{ position: [30, 20], color: 'green' }, { position: [60, 50], color: 'red' }];
      let map_markers = [{ position: [30, 20], color: 'green' }];
      markers.addMarkersViaUrl(params_markers, map_markers);
      expect(markers.addIcon).toHaveBeenCalledWith({ position: [60, 50], color: 'red' });
      expect(markers.addIcon).toHaveBeenCalledTimes(1);
    });

    it('removeMarkersViaUrl: should get {positions,color} array from map. for each {position,color} remove marker if not exists on params', () => {
      let not_exist_marker = { position: [60, 50], color: 'red' };
      spyOn(markers, 'removeIcon');
      let params_markers = [{ position: [30, 20], color: 'green' }];
      let map_markers = [{ position: [30, 20], color: 'green' }, not_exist_marker];
      markers.removeMarkersViaUrl(params_markers, map_markers);
      expect(markers.removeIcon).toHaveBeenCalledWith(not_exist_marker);
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

    // it('toggleMarkerPicker should get checked variable and invoke different functions accordingly', () => {
    //   spyOn(component.map, 'on').and.callFake(() => 'fakeLeftClickHandlerRes');
    //   spyOn(component.map, 'unByKey');
    //
    //   markers.toggleMarkerPicker(true);
    //   expect(component.map.on).toHaveBeenCalled();
    //   expect(markers.leftClickHandler).toEqual('fakeLeftClickHandlerRes');
    //
    //   markers.toggleMarkerPicker(false);
    //   expect(component.map.unByKey).toHaveBeenCalledWith(markers.leftClickHandler);
    // });

    it('leftClickInputAction should get event with coordinates and should convert toLonLat, and call addMarker with latlng', () => {
      let event: { pixel: ol.Pixel } = <any>{ pixel: [30, 30] };
      let fix_pixel: ol.Pixel = [event.pixel[0] + 18, event.pixel[1] + 48];

      spyOn(component.queryParamsHelperService, 'addMarker');
      spyOn(component.map, 'getCoordinateFromPixel').and.callFake((coordinate: ol.Pixel): ol.Coordinate => coordinate);
      spyOn(ol.proj, 'toLonLat').and.callFake((coordinate: ol.Pixel): ol.Coordinate => coordinate);

      positionFormService.selectedColorIndex = positionFormService.getSelectedColorIndex('yellow');
      markers.leftClickInputAction(event);
      expect(component.queryParamsHelperService.addMarker).toHaveBeenCalledWith({
        position: fix_pixel,
        color: 'yellow'
      });
    });

  });


});
