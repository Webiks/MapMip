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
  public _corridorEntity;
  public _positions:Array<any>=[];
  cartesian: any;
  longitude: any;
  private latitude:any ;
  altitude: any

  constructor(private cesium: CesiumComponent,private queryParamsHelperService: QueryParamsHelperService){

    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    cesium.positionFormService.polylinePickerEmitter.subscribe(this.togglePolylinePicker.bind(this));
  //  if(cesium.positionFormService.onPolylinePicked) this.togglePolylinePicker.bind(this)(true);
  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.cesium.positionFormService.polylinePickerEmitter.unsubscribe();
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


   /*     that.cesium.viewer.entities.add({
          // id: that.polyline_id+=1,
          // name : 'PolylineDrawer'+that.polyline_id,
          polyline: {
            show: true,
            positions:  Cesium.Cartesian3.fromDegreesArray((coords[0])),
            material : Cesium.Color.LIGHTSKYBLUE
          }

        });*/

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
    let that =this ;
    this._positions=[];
    console.log("1 "+this._positions);
    this._corridorEntity= this.cesium.viewer.entities.add({
       corridor: {
         show: true,
         positions: this.setCallbackProperty(this._positions)?this.setCallbackProperty(this._positions):[],
         width : 200
       }
     });
    console.log("2 "+this._positions);
/*
    this._polylineEntity= this.cesium.viewer.entities.add({
      polyline: {
        show: true,
        positions: this.setCallbackProperty(this._positions),
        material : Cesium.Color.LIGHTSKYBLUE
      }
    });*/

    this.initDrawer()
  }
  calcPositions(cartesianArr){
    // terrain case
    var positionArr=[];
    _.forEach(cartesianArr,function (cartesian) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      let latDeg: number = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      let lngDeg: number  = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      let altitude = cartographic.height;
      let altitudeString = Math.round(altitude).toString();
      positionArr.push(lngDeg, latDeg,altitude)
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

  private leftClickInputAction(event): void
  {
    this.startDrawPolyline(event);
  }

  private mouseMoveInputAction(event): void
  {
    this.updatePolyline(event);
  }

  private doubleClickInputAction(): void
  {
    this.endDrawPolyline();
  }


  private startDrawPolyline(iClickEvent)
  {
    var pickedObject = this.cesium.viewer.scene.pick(iClickEvent.endPosition || iClickEvent.position);
    this.cartesian = this.cesium.viewer.scene.pickPosition(iClickEvent.endPosition || iClickEvent.position )
   // let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.position, this.cesium.viewer.scene.globe.ellipsoid);
    var cartographic = Cesium.Cartographic.fromCartesian(this.cartesian);
    this.longitude = Cesium.Math.toDegrees(cartographic.longitude);
    this.latitude = Cesium.Math.toDegrees(cartographic.latitude);
    this.altitude = cartographic.height;
     if (!this.cartesian) return;
    console.log("3 "+this._positions);
    this._positions.push(this.cartesian);
  }

  private updatePolyline(iClickEvent)
  {
    var pickedObject = this.cesium.viewer.scene.pick(iClickEvent.endPosition || iClickEvent.position);
    let cartesian = this.cesium.viewer.scene.pickPosition(iClickEvent.endPosition || iClickEvent.position)
   // let cartesian = this.cesium.viewer.camera.pickEllipsoid(iClickEvent.endPosition, this.cesium.viewer.scene.globe.ellipsoid);
   if (!cartesian)  return;
    console.log("4 "+this._positions);
    if (this._positions.length == 1)
    {
      console.log("5 "+this._positions);
      this._positions.push(cartesian);
    }
    else if(this._positions.length > 1)
    {console.log("6 "+this._positions);
      this._positions.splice(this._positions.length - 1, 1, cartesian);
    }

  }

  private endDrawPolyline(){
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.cesium.viewer.cesiumHandler.destroy();
    //this._polylineEntity.polyline.show = true;
    let that = this;
    console.log("7 "+this._positions);
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


