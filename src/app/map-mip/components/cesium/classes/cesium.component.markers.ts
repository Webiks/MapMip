import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';
import * as _ from 'lodash';
import { SafeStyle } from '@angular/platform-browser';
import { MapMipMarker } from '../../../services/query-params-helper.service';

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
      if (width !== 18 ) { width += 3.5 }
      event.position.y += height;
      event.position.x += width;
    }


    const position: number[] = this.getLngLatViaPosition(event.position);
    const color: string = this.cesium.positionFormService.getSelectedColor();
    const label = this.cesium.positionFormService.markerLabel;
    const marker: MapMipMarker = color !== 'blue' ? { position, label, color } : { position, label };
    this.cesium.queryParamsHelperService.addMarker(marker);
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
      paramMarkerObj.color = paramMarkerObj.color ? paramMarkerObj.color : 'blue';
    });

    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartographicDegreesPositions);
  }


  getMarkersPosition() {
    let points = this.cesium.viewer.entities.values.filter((one) => one.billboard);

    let cartesianPositions = points.map((entity) => {
      let position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      let color: string = this.getColorFromBillboardEntity(entity);
      return { position, color };
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
        image: this.cesium.positionFormService.getMarkerUrlByColor(marker.color),
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

  removeMarker(marker: { position: any, color: string }) {
    let entity_to_remove = this.getEntityByPositionAndColor(marker);
    this.cesium.viewer.entities.remove(entity_to_remove);
  }

  getEntityByPositionAndColor(mapMarkerObj: { position: any, color: string }) {
    return this.cesium.viewer.entities.values.find(entity => {
      let e_position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      let e_color: string = this.getColorFromBillboardEntity(entity);
      mapMarkerObj.position = this.cesium.calcService.toFixes7Obj(mapMarkerObj.position);
      return _.isEqual(e_position, mapMarkerObj.position) && _.isEqual(e_color, mapMarkerObj.color);
    });
  }

  getColorFromBillboardEntity(entity): string {
    return this.cesium.positionFormService.getMarkerColorByUrl(entity.billboard.image.getValue());
  }

  markerExistOnMap(map_markers, paramsMarker: { position: any, color?: string }): boolean {
    let paramObjToCheck = {
      position: this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramsMarker.position)),
      color: paramsMarker.color ? paramsMarker.color : 'blue'
    };
    let exist_point = map_markers.find(markerObj => _.isEqual(paramObjToCheck, markerObj));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markers_params_positions, mapMarkerObj: { position: any, color: string }) {
    let exist_marker = markers_params_positions.find(paramsMarkerObj => {

      let paramPosition = Cesium.Cartesian3.fromDegrees(...paramsMarkerObj.position);
      let paramColor = paramsMarkerObj.color ? paramsMarkerObj.color : 'blue';

      let mapPosition = mapMarkerObj.position;
      let mapColor = mapMarkerObj.color;

      paramPosition = this.cesium.calcService.toFixes7Obj(paramPosition);
      mapPosition = this.cesium.calcService.toFixes7Obj(mapPosition);
      return _.isEqual(mapPosition, paramPosition) && _.isEqual(paramColor, mapColor);
    });

    return !_.isNil(exist_marker);
  }


}
