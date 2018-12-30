import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';
import * as _ from 'lodash';
import { SafeStyle } from '@angular/platform-browser';
import { MapMipMarker } from '../../../services/query-params-helper.service';
import { config } from '../../../../../config/config';

export class CesiumMarkers {

//  public cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.container.nativeElement);
  public cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.scene.canvas);

  public marker_picker = {
    not_allowed: false
  };

  queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    cesium.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
    if (cesium.positionFormService.onPicked) {
      this.toggleMarkerPicker.bind(this)(true);
    }
  }


  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.cesiumHandler.destroy();
  }

  queryParams(params: Params) {
    let params_changes: boolean = this.cesium.queryParamsHelperService.anyMarkersParamsChanges(this.cesium.prevParams, this.cesium.currentParams);
    let map_changes: boolean = this.anyMarkersMapChanges(params);

    if (params_changes && map_changes) {
      this.setMarkersChanges(params);
    }
  }

  getCursorStyle(): void | SafeStyle {
    if (this.cesium.positionFormService.onPicked) {
      if (this.marker_picker.not_allowed) {
        return 'not-allowed';
      } else {
        return this.cesium.positionFormService.getMarkerCursorStyle();
      }
    }
  }

  toggleMarkerPicker(checked: boolean) {
    if (checked) {
      this.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    } else {
      this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }

  mouseMoveInputAction(event: { endPosition: { x: number, y: number }, startPosition: { x: number, y: number } }) {
    let positionCartesian3Result = this.cesium.viewer.camera.pickEllipsoid(event.endPosition);
    this.marker_picker.not_allowed = _.isNil(positionCartesian3Result);
  }

  leftClickInputAction(event: { position: { x: number, y: number } }): void {
    if (this.marker_picker.not_allowed) {
      return;
    }

    if (this.onTerrainState()) {
      const height = this.cesium.positionFormService.getSelectedMarkerHeight();
      let width = this.cesium.positionFormService.getSelectedMarkerWidth() / 2;
      event.position.y += height;
      event.position.x += width;
    }
    const position: number[] = this.getLngLatViaPosition(event.position);
    const icon: string = this.cesium.positionFormService.getSelectedColor();
    const label = this.cesium.positionFormService.markerLabel;
    this.cesium.queryParamsHelperService.addMarker({ position, label, icon });
  }

  getLngLatViaPosition(position): number[] {
    let positionCartesian3;
    if (this.onTerrainState()) {
      positionCartesian3 = this.cesium.viewer.scene.pickPosition(position);
    } else {
      positionCartesian3 = this.cesium.viewer.camera.pickEllipsoid(position);
    }
    const positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
    const lngDeg: number = Cesium.Math.toDegrees(positionCartographic.longitude);
    const latDeg: number = Cesium.Math.toDegrees(positionCartographic.latitude);
    return [lngDeg, latDeg];

  }

  onTerrainState(): boolean {
    return !(this.cesium.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider);
  }

  anyMarkersMapChanges(params: Params): boolean {
    let queryMarkersCartographicDegreesPositions: Array<any> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let mapMarkerCartesienPositions = this.getMarkersPosition();

    queryMarkersCartographicDegreesPositions.forEach((paramMarkerObj) => {
      paramMarkerObj.position = this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramMarkerObj.position));
      paramMarkerObj.icon = paramMarkerObj.icon || config.defaultMarker.icon;
      paramMarkerObj.label = paramMarkerObj.label || '';
    });

    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartographicDegreesPositions);
  }


  getMarkersPosition() {
    let points = this.cesium.viewer.entities.values.filter((one) => one.billboard);

    let cartesianPositions = points.map((entity) => {
      const position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      const icon: string = this.getColorFromBillboardEntity(entity);
      const label: string = this.getLabelFromBillboardEntity(entity);
      return { position, icon, label };
    });

    return cartesianPositions;
  }


  setMarkersChanges(params: Params): void {
    let params_markers: Array<any> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let map_markers: Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers, map_markers);
    this.removeMarkersViaUrl(params_markers, map_markers);
  }

  addMarkersViaUrl(params_markers, map_markers) {
    params_markers.forEach((marker) => {
      if (!this.markerExistOnMap(map_markers, marker)) {
        this.addMarker(marker);
      }
    });
  }

  removeMarkersViaUrl(params_markers, map_markers) {
    map_markers.forEach(mapMarkerObj => {
      if (!this.markerExistOnParams(params_markers, mapMarkerObj)) {
        this.removeMarker(mapMarkerObj);
      }
    });
  }

  addMarker(marker: MapMipMarker): void {
    this.cesium.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(...marker.position),
      billboard: {
        image: this.cesium.positionFormService.getMarkerUrlByColor(marker.icon),
        horizontalOrigin: this.onTerrainState() ? Cesium.HorizontalOrigin.CENTER : Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: this.onTerrainState() ? Cesium.VerticalOrigin.BOTTOM : Cesium.VerticalOrigin.TOP,
        heightReference: this.onTerrainState() ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
      },
      label: {
        text: marker.label,
        showBackground: true,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: this.onTerrainState() ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
      }
    });
  }

  removeMarker(marker: MapMipMarker) {
    let entity_to_remove = this.getEntityByMarker(marker);
    this.cesium.viewer.entities.remove(entity_to_remove);
  }

  getEntityByMarker(mapMarkerObj: MapMipMarker) {
    return this.cesium.viewer.entities.values.find(entity => {
      let position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      let icon: string = this.getColorFromBillboardEntity(entity);
      let label: string = this.getLabelFromBillboardEntity(entity);
      mapMarkerObj.position = this.cesium.calcService.toFixes7Obj(mapMarkerObj.position);
      return _.isEqual({ position, icon, label }, mapMarkerObj);
    });
  }

  getColorFromBillboardEntity(entity): string {
    return this.cesium.positionFormService.getMarkerColorByUrl(entity.billboard.image.getValue());
  }

  getLabelFromBillboardEntity(entity): string {
    return entity.label.text && entity.label.text.getValue();
  }

  markerExistOnMap(map_markers, paramsMarker: MapMipMarker): boolean {
    let paramObjToCheck = {
      position: this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramsMarker.position)),
      icon: paramsMarker.icon || config.defaultMarker.icon,
      label: paramsMarker.label || config.defaultMarker.label
    };
    let exist_point = map_markers.find(markerObj => _.isEqual(paramObjToCheck, markerObj));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markers_params_positions, mapMarkerObj: MapMipMarker) {
    return markers_params_positions.some(paramsMarkerObj => {
      const fromMap = [
        this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramsMarkerObj.position)),
        paramsMarkerObj.icon || config.defaultMarker.icon,
        paramsMarkerObj.label || config.defaultMarker.label
      ];
      const fromParams = [
        this.cesium.calcService.toFixes7Obj(mapMarkerObj.position),
        mapMarkerObj.icon,
        mapMarkerObj.label
      ];
      return _.isEqual(fromMap, fromParams);
    });
  }


}
