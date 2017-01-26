import {Params} from "@angular/router";
import {CesiumComponent} from "./cesium.component";
import * as _ from 'lodash';
import {SafeStyle} from "@angular/platform-browser";

const DEFAULT_MARKER_COLOR = "blue";

export class Markers {

  public cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.cesiumContainer.nativeElement);

  public marker_picker = {
    not_allowed: false
  };

  constructor(private cesium:CesiumComponent){}

  getCursorStyle(): void | SafeStyle {
    if(this.cesium.positionFormService.onPicked) {
      if(this.marker_picker.not_allowed) {
        return "not-allowed";
      } else {
        return this.cesium.positionFormService.getMarkerCursorStyle();
      }
    }
  }

  toggleMarkerPicker(checked:boolean){
    if(checked){
      this.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    } else {
      this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }

  mouseMoveInputAction(event:{endPosition: {x:number, y:number}, startPosition: {x:number, y:number}}){
    let positionCartesian3Result = this.cesium.viewer.camera.pickEllipsoid(event.endPosition);
    this.marker_picker.not_allowed = _.isNil(positionCartesian3Result);
  }

  leftClickInputAction(event:{position: {x:number, y:number}}):void {
    if(this.marker_picker.not_allowed) return;
    let positionCartesian3 = this.cesium.viewer.camera.pickEllipsoid(event.position);
    let positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
    let lngDeg:number = Cesium.Math.toDegrees(positionCartographic.longitude);
    let latDeg:number = Cesium.Math.toDegrees(positionCartographic.latitude);
    let position: [number, number] = [lngDeg, latDeg];
    let color:string = this.cesium.positionFormService.getSelectedColor();
    let marker_picker = {position};
    if(color != "blue") marker_picker['color'] = color;
    this.cesium.queryParamsHelperService.addMarker(marker_picker);
  }

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersCartographicDegreesPositions:Array<any> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let mapMarkerCartesienPositions = this.getMarkersPosition();

    queryMarkersCartographicDegreesPositions.forEach((paramMarkerObj) => {
      paramMarkerObj.position = this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramMarkerObj.position));
    });

    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartographicDegreesPositions);
  }


  getMarkersPosition() {
    let points = this.cesium.viewer.entities.values.filter( (one) => one.billboard );

    let cartesianPositions = points.map( (entity) => {
      let position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      let color:string = this.getColorFromBillboardEntity(entity);
      return {position,color}
    });

    return cartesianPositions;
  }


  setMarkersChanges(params:Params):void {
    let params_markers:Array<any> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let map_markers:Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers);
    this.removeMarkersViaUrl(map_markers);
  }

  addMarkersViaUrl(params_markers) {
    params_markers.forEach( (marker) => {
      if(!this.markerExistOnMap(marker)) {
        this.addMarker(marker);
      }
    });
  }

  addMarker(marker:{position:any, color:string}):void{
      this.cesium.viewer.entities.add({
      position : Cesium.Cartesian3.fromDegrees(...marker.position),
      billboard: {
        image: `/assets/Markers/marker-icon-${marker.color ? marker.color : DEFAULT_MARKER_COLOR }.png`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin:Cesium.VerticalOrigin.TOP
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions) {
    let markers_params_positions = this.cesium.queryParamsHelperService.queryMarkers(this.cesium.currentParams);
    map_markers_positions.forEach(mapMarkerObj => {
      if(!this.markerExistOnParams(markers_params_positions, mapMarkerObj)) {
        let entity_to_remove = this.getEntityByPositionAndColor(mapMarkerObj);
        this.cesium.viewer.entities.remove(entity_to_remove);
      }
    })
  }

  getEntityByPositionAndColor(mapMarkerObj:{position:any, color:string}){
    return this.cesium.viewer.entities.values.find( entity => {
      let e_position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
      let e_color:string = this.getColorFromBillboardEntity(entity);
      mapMarkerObj.position = this.cesium.calcService.toFixes7Obj(mapMarkerObj.position);
      return _.isEqual(e_position, mapMarkerObj.position) && _.isEqual(e_color, mapMarkerObj.color);
    });
   }

  getColorFromBillboardEntity(entity):string {
    return entity.billboard.image.getValue().replace("/assets/Markers/marker-icon-", "").replace(".png","");
  }

  markerExistOnMap(paramsMarker:{position:any, color:string}):boolean {
    let current_marker_radian_position = this.cesium.calcService.toFixes7Obj(Cesium.Cartesian3.fromDegrees(...paramsMarker.position));
    paramsMarker.color = paramsMarker.color ? paramsMarker.color : "blue";
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions .find(markerObj => _.isEqual(markerObj.position, current_marker_radian_position) && _.isEqual(markerObj.color, paramsMarker.color));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markers_params_positions, mapMarkerObj) {
    let exist_marker = markers_params_positions.find(paramsMarkerObj => {

      let paramPosition = Cesium.Cartesian3.fromDegrees(...paramsMarkerObj.position);
      let paramColor = paramsMarkerObj.color ? paramsMarkerObj.color : "blue";

      let mapPosition = mapMarkerObj.position;
      let mapColor = mapMarkerObj.color;

      paramPosition = this.cesium.calcService.toFixes7Obj(paramPosition);
      mapPosition = this.cesium.calcService.toFixes7Obj(mapPosition);
      return _.isEqual(mapPosition, paramPosition) && _.isEqual(paramColor, mapColor)
    });

    return !_.isNil(exist_marker);
  }




}
