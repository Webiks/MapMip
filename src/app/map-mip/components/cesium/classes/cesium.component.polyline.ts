/**
 * Created by USSeR on 6/1/2017.
 */
import {Params} from "@angular/router";
import {CesiumComponent} from "../cesium.component";
import * as _ from "lodash";
import {isFunction, isUndefined} from "util";
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {AppState} from '../../../app.store';

export class CesiumPolyline{
  queryParamsSubscriber;
  public _polylineEntity;
  public _positions:Array<any>=[]; //TODO: should be on the url
  public polyline_id=0;
  public polyline_changed:AppState = new AppState(this.cesium.router);
  constructor(private cesium: CesiumComponent,private queryParamsHelperService: QueryParamsHelperService){

    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    cesium.positionFormService.polylinePickerEmitter.subscribe(this.togglePolylinePicker.bind(this));
  //  if(cesium.positionFormService.onPolylinePicked) this.togglePolylinePicker.bind(this)(true);
  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.cesium.positionFormService.polylinePickerEmitter.unsubscribe();
    this.cesium.viewer.cesiumHandler.destroy();
  }

  queryParams(params: Params) {
    let params_changes:boolean = this.cesium.queryParamsHelperService.anyPolylineChange(this.cesium.prevParams, this.cesium.currentParams);
    if( params_changes ) {
      this.setPolylineChanges(params);
    }

  }
  setPolylineChanges(params:Params):void{
    let params_polyline_array: Array<Object> = this.cesium.queryParamsHelperService.queryPolyline(params);
    this.addPolylineViaUrl(params_polyline_array);
  }

  addPolylineViaUrl(params_polyline_array: any[]) {
    const polylinesOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polyline']);

    polylinesOnMap.forEach(polyline_obj => {
      this.cesium.viewer.entities.remove(polyline_obj);
    });

    let that =this;
    params_polyline_array.forEach(polyline_obj => {
      let coords = [];
      coords.push(polyline_obj.coords)
      if(!this.polylineExistOnMap(coords)) {
        //add to map


        that.cesium.viewer.entities.add({
          // id: that.polyline_id+=1,
          // name : 'PolylineDrawer'+that.polyline_id,
          polyline: {
            show: true,
            positions:  Cesium.Cartesian3.fromDegreesArray((coords[0])),
            material : Cesium.Color.LIGHTSKYBLUE
          }

        });

      }
    });

  }
  polylineExistOnMap(coords):boolean{
    //no entities on map - don't check:
    const polylinesOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polyline']);
    if (polylinesOnMap.length==0)
      return false;
    if (this.cesium.viewer.entities.values==0)
    {
      return false;
    }
    for (let a=0; a<this.cesium.viewer.entities.values.length;a++) {

      if(this.cesium.viewer.entities.values[a].polyline){

      var exist = this.cesium.viewer.entities.values[a].polyline.positions.getValue();


      for (let i = 0; i < exist.length; i++) {
        let lng = Cesium.Cartographic.fromCartesian(exist[i]).longitude;
        let lngDeg = Cesium.Math.toDegrees(lng);
        let lngFixed = lngDeg.toFixed(7);

        let lat = Cesium.Cartographic.fromCartesian(exist[i]).latitude;
        let latDeg = Cesium.Math.toDegrees(lat)
        let latFixed = latDeg.toFixed(7);

        if (lngFixed !== coords[0][(2 * i)] || latFixed !== coords[0][(2 * i) + 1])
          return false;
      }
    }

    }
    return true;
  }
  togglePolylinePicker(){
    this._positions=[];

    this._polylineEntity= this.cesium.viewer.entities.add({
      polyline: {
        show: true,
        positions: this.setCallbackProperty(this._positions),
        material : Cesium.Color.LIGHTSKYBLUE
      }
    });

    this.initDrawer()
  }
  calcPositions(cartesianArr){
    // terrain case
    var positionArr=[];
    _.forEach(cartesianArr,function (cartesian,index) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      let latDeg: number = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      let lngDeg: number  = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      positionArr.push(lngDeg, latDeg)
    });
    positionArr.splice(positionArr.length-4, 4); //remove redundant points from double click
    positionArr=positionArr.map(newArr=>parseFloat(newArr));
    return positionArr;

  }

  initDrawer()
  {
    this.cesium.viewer.cesiumHandler= new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.scene.canvas);
    this.cesium.viewer.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.cesium.viewer.cesiumHandler.setInputAction(this.doubleClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //end draw polygon
  }

  private leftClickInputAction(event: {position: {x: number, y: number}}): void
  {
    this.startDrawPolygon(event);
  }

  private mouseMoveInputAction(event: {endPosition: {x: number, y: number}}): void
  {
    this.updatePolygon(event);
  }

  private doubleClickInputAction(event: {position: {x: number, y: number}}): void
  {
    this.endDrawPolygon();
  }


  private startDrawPolygon(iClickEvent)
  {
    let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.position, this.cesium.viewer.scene.globe.ellipsoid);
    if (!cartesian) return;

    this._polylineEntity.polyline.show = true;

    this._positions.push(cartesian);
  }

  private updatePolygon(iClickEvent)
  {
    let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.endPosition, this.cesium.viewer.scene.globe.ellipsoid);
    if (!cartesian)
      return;

    if (this._positions.length == 1)
    {
      this._positions.push(cartesian);
    }
    else if(this._positions.length > 1)
    {
      this._positions.splice(this._positions.length - 1, 1, cartesian);
    }

    console.log(this._positions.length);
  }

  private endDrawPolygon(){
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._polylineEntity.polyline.show = true;
    let that = this;


    that.queryParamsHelperService.addPolyline(that.calcPositions(this._positions));


  }

  private setCallbackProperty(value, property?)
  {
    return new Cesium.CallbackProperty(function () {
      // handle a function
      if (isFunction(value)){
        return value(property);
      }

      // handle reference binding
      if (!isUndefined(property)){
        return value[property];
      }

      return value;
    },false)
  }

}


