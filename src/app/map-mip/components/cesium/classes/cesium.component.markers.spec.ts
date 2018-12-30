import { CesiumComponent } from '../cesium.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { CalcService } from '../../../services/calc-service';
import { PositionFormService } from '../../../position-form/position-form.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CesiumMarkers } from './cesium.component.markers';
import { MapMipService } from '../../../api/map-mip.service';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { config } from '../../../../../config/config';

xdescribe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let calcService: CalcService;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        BrowserAnimationsModule
      ],
      declarations: [CesiumComponent],
      providers: [QueryParamsHelperService, MapMipService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));
  beforeEach(inject([QueryParamsHelperService, CalcService, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _calcService: CalcService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
    positionFormService = _positionFormService;
  }));

  describe('markers', () => {

    let markers: CesiumMarkers;

    beforeEach(() => {
      markers = component.markers;
    });

    it('queryParams: setMarkersChanges: should have been call only when both params_changes and map_changes are "true" ', () => {
      let params_changes = true;
      let map_changes = true;

      spyOn(component.markers, 'anyMarkersMapChanges').and.callFake(() => map_changes);
      spyOn(queryParamsHelperService, 'anyMarkersParamsChanges').and.callFake(() => params_changes);
      spyOn(component.markers, 'setMarkersChanges');

      let params: Params = {
        lat: '1.123',
        lng: '4.567',
        markers: '(1,2,3),(4,5,6)'
      };

      params_changes = true;
      map_changes = false;
      markers.queryParams(params);
      expect(component.markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = false;
      map_changes = true;
      markers.queryParams(params);
      expect(component.markers.setMarkersChanges).not.toHaveBeenCalledWith(params);

      params_changes = true;
      map_changes = true;
      markers.queryParams(params);
      expect(component.markers.setMarkersChanges).toHaveBeenCalledWith(params);

    });

    it('destroy', () => {
      spyOn(markers.queryParamsSubscriber, 'unsubscribe');
      markers.destroy();
      expect(markers.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('setMarkersChanges: should call addMarkersViaUrl with params_markers_position and call removeMarkersViaUrl with map_markers_positions', () => {
      let params: Params = {};
      let params_marker1 = { position: [30, 20], color: 'green' };
      let params_marker2 = { position: [60, 50, 40] };
      let map_marker1 = { position: Cesium.Cartesian3.fromDegrees(...[30, 20]), color: 'green' };
      let map_marker2 = {
        position: Cesium.Cartesian3.fromDegrees(...[60, 50, 40]),
        color: config.defaultMarker.icon
      };
      let params_markers = [params_marker1, params_marker2];
      let map_markers = [map_marker1, map_marker2];
      spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);
      spyOn(markers, 'addMarkersViaUrl');
      spyOn(markers, 'removeMarkersViaUrl');
      markers.setMarkersChanges(params);
      expect(markers.addMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
      expect(markers.removeMarkersViaUrl).toHaveBeenCalledWith(params_markers, map_markers);
    });


    it('addMarkersViaUrl: should get positions array from params. for each position create marker if not exists on map', () => {
      let markers_map_positions = [
        { position: Cesium.Cartesian3.fromDegrees(...[1, 2, 3]), color: 'red' }
      ];
      let markers_params_positions = [
        { position: [1, 2, 3], color: 'red' },
        { position: [4, 5, 6] }
      ];
      spyOn(markers, 'addMarker');
      markers.addMarkersViaUrl(markers_params_positions, markers_map_positions);
      expect(markers.addMarker).toHaveBeenCalledWith(markers_params_positions[1]);
    });

    it('removeMarkersViaUrl should get positions array from map. for each position remvoe marker if not exists on params', () => {
      let markers_map_positions = [
        { position: Cesium.Cartesian3.fromDegrees(...[1, 2, 3]), color: 'red' },
        { position: Cesium.Cartesian3.fromDegrees(...[4, 5, 6]), color: config.defaultMarker.icon }
      ];
      let markers_params_positions = [
        { position: [1, 2, 3], color: 'red' }
      ];
      spyOn(markers, 'removeMarker');
      markers.removeMarkersViaUrl(markers_params_positions, markers_map_positions);
      expect(markers.removeMarker).toHaveBeenCalledWith(markers_map_positions[1]);
    });

    it('markerExistOnMap: should get one position and return if there is marker on map with that position', () => {
      let markers_map_positions = [
        { position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[1, 2, 3])), color: 'red' },
        {
          position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[4, 5, 6])),
          color: config.defaultMarker.icon
        }
      ];
      let paramMarkerObj = {
        position: [1, 2, 3],
        color: 'red'
      };
      let blueParamMarkerObj = {
        position: [4, 5, 6]
      };
      let notExistMapMarkerObj = {
        position: [7, 8, 9],
        color: 'black'
      };
      expect(markers.markerExistOnMap(markers_map_positions, paramMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnMap(markers_map_positions, blueParamMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnMap(markers_map_positions, notExistMapMarkerObj)).toBeFalsy();
    });

    it('markerExistOnParams: should get one position and return if there is marker on params with that position', () => {
      let markers_params_positions = [
        { position: [1, 2, 3], color: 'red' },
        { position: [4, 5, 6] }
      ];
      let mapMarkerObj = {
        position: Cesium.Cartesian3.fromDegrees(...[1, 2, 3]),
        color: 'red'
      };
      let blueMapMarkerObj = {
        position: Cesium.Cartesian3.fromDegrees(...[4, 5, 6]),
        color: config.defaultMarker.icon
      };
      let notExistMapMarkerObj = {
        position: Cesium.Cartesian3.fromDegrees(...[7, 8, 9]),
        color: 'black'
      };
      expect(markers.markerExistOnParams(markers_params_positions, mapMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnParams(markers_params_positions, blueMapMarkerObj)).toBeTruthy();
      expect(markers.markerExistOnParams(markers_params_positions, notExistMapMarkerObj)).toBeFalsy();
    });

    it('anyMarkersMapChanges: should get params and compere between markers on params and markers on map', () => {
      let params_marker1 = { position: [30, 20], color: 'green' };
      let params_marker2 = { position: [60, 50, 40] };
      let map_marker1 = {
        position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[30, 20])),
        color: 'green'
      };
      let map_marker2 = {
        position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[60, 50, 40])),
        color: config.defaultMarker.icon
      };
      let params_markers = [params_marker1, params_marker2];
      let map_markers = [map_marker1, map_marker2];

      spyOn(queryParamsHelperService, 'queryMarkers').and.callFake(() => params_markers);
      spyOn(markers, 'getMarkersPosition').and.callFake(() => map_markers);

      expect(markers.anyMarkersMapChanges({})).toBeFalsy();
      params_marker1 = { position: [31, 20], color: 'green' };
      params_marker2 = { position: [60, 50, 40] };
      params_markers = [params_marker1, params_marker2];
      expect(markers.anyMarkersMapChanges({})).toBeTruthy();

      expect(queryParamsHelperService.queryMarkers).toHaveBeenCalledTimes(2);
      expect(markers.getMarkersPosition).toHaveBeenCalledTimes(2);
    });

    it('getMarkersPosition should return positions array ( [lng, lat], [lng, lat],...)', () => {
      component.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(...[1, 2, 3]),
        billboard: {
          image: positionFormService.getMarkerUrlByColor('red')
        }
      });
      component.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(...[4, 5, 6]),
        billboard: {
          image: positionFormService.getMarkerUrlByColor('green')
        }
      });
      expect(markers.getMarkersPosition().length).toEqual(2);
      expect(markers.getMarkersPosition()[0]).toEqual({
        position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[1, 2, 3])),
        color: 'red'
      });
      expect(markers.getMarkersPosition()[1]).toEqual({
        position: calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...[4, 5, 6])),
        color: 'green'
      });
    });

    it('toggleMarkerPicker should get checked variable and invoke different functions accordingly', () => {
      spyOn(markers.cesiumHandler, 'setInputAction');
      markers.toggleMarkerPicker(true);
      expect(markers.cesiumHandler.setInputAction).toHaveBeenCalledTimes(2);
      spyOn(markers.cesiumHandler, 'removeInputAction');
      markers.toggleMarkerPicker(false);
      expect(markers.cesiumHandler.removeInputAction).toHaveBeenCalledWith(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      expect(markers.cesiumHandler.removeInputAction).toHaveBeenCalledWith(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    });

    it('leftClickInputAction get event with cartesian2 position (x,y),should: convert position to cartesian3, next convert cartesian3 position to cartographic final convert lat,lng from radian to degrees and send to addMarker', () => {
      spyOn(queryParamsHelperService, 'addMarker');
      markers.marker_picker.not_allowed = true;
      expect(queryParamsHelperService.addMarker).not.toHaveBeenCalled();

      markers.marker_picker.not_allowed = false;
      let event: { position: { x: number, y: number } } = { position: { x: 0, y: 0 } };
      let radian_30 = Cesium.Math.toRadians(30);
      let deg_30 = Cesium.Math.toDegrees(radian_30);

      spyOn(Cesium.Cartographic, 'fromCartesian').and.callFake((): Object => new Object({
        latitude: radian_30,
        longitude: radian_30
      }));
      markers.leftClickInputAction(event);
      let position = [deg_30, deg_30];
      expect(queryParamsHelperService.addMarker).toHaveBeenCalledWith({ position });
    });

    it('mouseMoveInputAction', () => {
      let pickEllipsoidRes = undefined;
      let event: { endPosition: { x: number, y: number }, startPosition: { x: number, y: number } } = <any>{};
      spyOn(component.viewer.camera, 'pickEllipsoid').and.callFake(() => pickEllipsoidRes);
      markers.mouseMoveInputAction(event);
      expect(component.viewer.camera.pickEllipsoid).toHaveBeenCalled();
      expect(markers.marker_picker.not_allowed).toBeTruthy();
      pickEllipsoidRes = { x: 0, y: 0, z: 0 };
      markers.mouseMoveInputAction(event);
      expect(component.viewer.camera.pickEllipsoid).toHaveBeenCalled();
      expect(markers.marker_picker.not_allowed).toBeFalsy();
    });

    it(' getColorFromBillboardEntity: should  get Color From Billboard Entity', () => {
      let entity = {
        billboard: {
          image: {
            getValue: () => '/assets/Markers/marker-icon-red.png'
          }
        }
      };
      expect(markers.getColorFromBillboardEntity(entity)).toEqual('red');
    });

    it('should addMarker add billboard marker to entities', () => {
      let marker = { position: [1, 2, 3] };
      spyOn(component.viewer.entities, 'add');
      markers.addMarker(marker);
      expect(component.viewer.entities.add).toHaveBeenCalledWith({
        position: Cesium.Cartesian3.fromDegrees(...marker.position),
        billboard: {
          image: component.positionFormService.getMarkerUrlByColor(marker.icon),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
    });

    it('should removeMarker rmv billboard marker from entities', () => {
      let marker = { position: Cesium.Cartesian3.fromDegrees(...[1, 2, 3]), color: config.defaultMarker.icon };
      spyOn(markers, 'getEntityByMarker').and.callFake(() => marker);
      spyOn(component.viewer.entities, 'remove');
      markers.removeMarker(marker);
      expect(component.viewer.entities.remove).toHaveBeenCalledWith(marker);
    });
  });
});
