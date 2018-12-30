/**
 * Created by USSeR on 5/18/2017.
 */
import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';
import * as _ from 'lodash';
import { isFunction, isUndefined } from 'util';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { AppState } from '../../../app.store';

export class CesiumPolygons {
  queryParamsSubscriber;
  public _polygonEntity;
  public _positions: Array<any> = [];
  public polygon_id = 0;
  public polygons_changed: AppState = new AppState(this.cesium.router);

  constructor(private cesium: CesiumComponent, private queryParamsHelperService: QueryParamsHelperService) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    cesium.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    if (cesium.positionFormService.onPolygonPicked) {
      this.togglePolygonPicker.bind(this)(true);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.cesium.positionFormService.polygonPickerEmitter.unsubscribe();
    this.cesium.viewer.cesiumHandler.destroy();
  }

  queryParams(params: Params) {
    let params_changes: boolean = this.cesium.queryParamsHelperService.anyPolygonsChange(this.cesium.prevParams, this.cesium.currentParams);
    if (params_changes) {
      this.setPolygonChanges(params);
    }

  }

  setPolygonChanges(params: Params): void {
    let params_polygons_array: Array<Object> = this.cesium.queryParamsHelperService.queryPolygons(params);
    this.addPolygonsViaUrl(params_polygons_array);
  }

  addPolygonsViaUrl(params_polygons_array: any[]) {
    const polygonsOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polygon']);

    polygonsOnMap.forEach(polygon_obj => {
      this.cesium.viewer.entities.remove(polygon_obj);
    });

    let that = this;
    params_polygons_array.forEach(polygon_obj => {
      let coords = [];
      coords.push(polygon_obj.coords);
      if (!this.polygonsExistOnMap(coords)) {
        that.cesium.viewer.entities.add({
          id: that.polygon_id += 1,
          name: 'PolygonDrawer' + that.polygon_id,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(coords[0])),
            material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.RED
          }
        });
      }
    });
  }

  polygonsExistOnMap(coords): boolean {
    // no entities on map - don't check:
    const polygonsOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polygon']);
    if (polygonsOnMap.length === 0) {
      return false;
    }

    for (let a = 0; a < this.cesium.viewer.entities.values.length; a++) {
      if (this.cesium.viewer.entities.values[a].polygon) {


        const exist = this.cesium.viewer.entities.values[a].polygon.hierarchy.getValue();


        for (let i = 0; i < exist.positions.length; i++) {
          let lng = Cesium.Cartographic.fromCartesian(exist.positions[i]).longitude;
          let lngDeg = Cesium.Math.toDegrees(lng);
          let lngFixed = lngDeg.toFixed(7);

          let lat = Cesium.Cartographic.fromCartesian(exist.positions[i]).latitude;
          let latDeg = Cesium.Math.toDegrees(lat);
          let latFixed = latDeg.toFixed(7);

          if (lngFixed !== coords[0][(2 * i)] || latFixed !== coords[0][(2 * i) + 1]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  togglePolygonPicker() {
    this._positions = [];

    this._polygonEntity = this.cesium.viewer.entities.add({
      id: this.polygon_id += 1,
      name: 'PolygonDrawer' + this.polygon_id,
      polyline: {
        show: true,
        positions: this.setCallbackProperty(this._positions),
        material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5)
      },
      polygon: {
        hierarchy: this.setCallbackProperty(this._positions),
        material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.LIGHTSKYBLUE
      }
    });

    this.initDrawer();
  }

  calcPositions(cartesianArr) {
    // terrain case
    let positionArr = [];
    /*if(this.cesium.viewer.terrainProvider.hasOwnProperty("_url")) {
      //var pickedObject = this.cesium.viewer.scene.pick(event.position); // Tr
      let positionCartesian3 = this.cesium.viewer.scene.pickPosition(event.position); // Tr
      let positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
      let lngDeg: number = Cesium.Math.toDegrees(positionCartographic.longitude);
      let latDeg: number = Cesium.Math.toDegrees(positionCartographic.latitude);
      position = [lngDeg, latDeg];
    }
    else {
      let positionCartesian3 = this.cesium.viewer.camera.pickEllipsoid(event.position);
      let positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
      let lngDeg: number = Cesium.Math.toDegrees(positionCartographic.longitude);
      let latDeg: number = Cesium.Math.toDegrees(positionCartographic.latitude);
      position = [lngDeg, latDeg];
    }*/
    /* for (let i = 0; i < cartesianArr.length - 2; i++){

     }*/
    _.forEach(cartesianArr, function (cartesian, index) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      let latDeg: number = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      let lngDeg: number = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      positionArr.push(lngDeg, latDeg);
    });
    positionArr.splice(positionArr.length - 4, 4); // remove redundant points from double click
    positionArr = positionArr.map(newArr => parseFloat(newArr));
    return positionArr;

  }

  initDrawer() {
    this.cesium.viewer.cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.scene.canvas);
    this.cesium.viewer.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.cesium.viewer.cesiumHandler.setInputAction(this.doubleClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); // end draw polygon
  }

  /*ngOnDestroy() {
    if(!isUndefined(this._cesiumHandler))
    {
      this._cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this._cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this._cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    if(!isUndefined(this._parentComponent.cesiumViewerLoaded))
      this._parentComponent.cesiumViewerLoaded.unsubscribe();
  }
*/
  private leftClickInputAction(event: { position: { x: number, y: number } }): void {
    this.startDrawPolygon(event);
  }

  private mouseMoveInputAction(event: { endPosition: { x: number, y: number } }): void {
    this.updatePolygon(event);
  }

  private doubleClickInputAction(event: { position: { x: number, y: number } }): void {
    this.endDrawPolygon();
  }


  private startDrawPolygon(iClickEvent) {
    let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.position, this.cesium.viewer.scene.globe.ellipsoid);
    if (!cartesian) {
      return;
    }

    this._polygonEntity.polyline.show = true;
    this._polygonEntity.polygon.show = false;

    this._positions.push(cartesian);
  }

  private updatePolygon(iClickEvent) {
    let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.endPosition, this.cesium.viewer.scene.globe.ellipsoid);
    if (!cartesian) {
      return;
    }

    if (this._positions.length === 1) {
      this._positions.push(cartesian);
    } else if (this._positions.length > 1) {
      this._positions.splice(this._positions.length - 1, 1, cartesian);
    }

    console.log(this._positions.length);
  }

  private endDrawPolygon() {
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._polygonEntity.polyline.show = false;
    this._polygonEntity.polygon.show = true;
    let that = this;


    that.queryParamsHelperService.addPolygon(that.calcPositions(this._positions));


  }


  private resetPolygon() {
    this._positions.length = 0;
    this._polygonEntity.polyline.show = false;
    this._polygonEntity.polygon.show = false;

    if (!isUndefined(this.cesium.viewer.cesiumHandler)) {
      this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
  }

  private setCallbackProperty(value, property?) {
    return new Cesium.CallbackProperty(function () {
      // handle a function
      if (isFunction(value)) {
        return value(property);
      }

      // handle reference binding
      if (!isUndefined(property)) {
        return value[property];
      }

      return value;
    }, false);
  }

}


