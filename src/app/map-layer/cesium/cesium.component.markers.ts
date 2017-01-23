import {Params} from "@angular/router";
import {CesiumComponent} from "./cesium.component";
import * as _ from 'lodash';


export class Markers {
  constructor(private cesium:CesiumComponent){}

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersCartographicDegreesPositions:Array<[number, number, number]> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let mapMarkerCartesienPositions = this.getMarkersPosition();
    let queryMarkersCartesienPositions = queryMarkersCartographicDegreesPositions.map((marker) => Cesium.Cartesian3.fromDegrees(...marker));
    mapMarkerCartesienPositions    =  mapMarkerCartesienPositions.map( mapMarkerCartesienPosition => this.cesium.calcService.toFixes7Obj(mapMarkerCartesienPosition));
    queryMarkersCartesienPositions =  queryMarkersCartesienPositions.map( queryMarkerCartesienPosition => this.cesium.calcService.toFixes7Obj(queryMarkerCartesienPosition));
    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartesienPositions ) ;
  }


  getMarkersPosition() {
    let points = this.cesium.viewer.entities.values.filter( (one) => one.billboard );
    let cartesianPositions = points.map( (entity) => {
      return entity.position.getValue();
    });
    return cartesianPositions;
  }


  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<[number, number, number]> = this.cesium.queryParamsHelperService.queryMarkers(params);
    let map_markers_positions:Array<[number, number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position) {
    params_markers_position.forEach( (marker) => {
      if(!this.markerExistOnMap(marker)) {
        this.addMarker(marker);
      }
    });
  }

  addMarker(marker):void{
    this.cesium.viewer.entities.add({
      position : Cesium.Cartesian3.fromDegrees(...marker),
      billboard: {
        image: "/assets/Leaflet/images/marker-icon.png"
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions) {
    map_markers_positions.forEach((cartesianPosition) => {
      if(!this.markerExistOnParams(cartesianPosition)) {
        let entity_to_remove = this.cesium.viewer.entities.values.find((entity) => {
          let position = this.cesium.calcService.toFixes7Obj(entity.position.getValue());
          cartesianPosition = this.cesium.calcService.toFixes7Obj(cartesianPosition);
          return _.isEqual(position, cartesianPosition);
        });
        this.cesium.viewer.entities.remove(entity_to_remove)
      }
    })
  }

  markerExistOnMap(markerPosition:[number,number, number]):boolean {
    let current_marker_radian_position = Cesium.Cartesian3.fromDegrees(...markerPosition);
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions .find((positionArray) => _.isEqual(positionArray, current_marker_radian_position));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition:{x:number,y:number,z:number}) {

    let markers_params_positions = this.cesium.queryParamsHelperService.queryMarkers(this.cesium.currentParams);

    let exist_point = markers_params_positions.find((positionArray) => {
      let positionCartesian = Cesium.Cartesian3.fromDegrees(...positionArray);
      positionCartesian = this.cesium.calcService.toFixes7Obj(positionCartesian);
      markerPosition = this.cesium.calcService.toFixes7Obj(markerPosition );
      return _.isEqual(positionCartesian, markerPosition)
    });
    return !_.isEmpty(exist_point);
  }


}
