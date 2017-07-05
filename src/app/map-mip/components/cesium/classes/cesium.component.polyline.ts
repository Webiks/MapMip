/**
 * Created by USSeR on 6/1/2017.
 */
import {Params} from "@angular/router";
import {CesiumComponent} from "../cesium.component";
import * as _ from "lodash";
import {isFunction, isUndefined} from "util";
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";

export class CesiumPolyline{
  queryParamsSubscriber;
  public _polylineEntity;
  public _positions:Array<any>=[];
  public handler:any;
  public drawing:boolean = false;
  public polyline:any;
  public positions = [];
  constructor(private cesium: CesiumComponent,private queryParamsHelperService: QueryParamsHelperService){

    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    cesium.positionFormService.polylinePickerEmitter.subscribe(this.togglePolylinePicker.bind(this));
  //  if(cesium.positionFormService.onPolylinePicked) this.togglePolylinePicker.bind(this)(true);
    this.handler = new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.canvas);
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
    this.addPolylineViaUrl(params_polyline_array,params);
  }

  addPolylineViaUrl(params_polyline_array: any[],params) {
    const polylinesOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polyline']);

    polylinesOnMap.forEach(polyline_obj => {
      this.cesium.viewer.entities.remove(polyline_obj);
    });

    let that =this;
    params_polyline_array.forEach(polyline_obj => {
      let coords = [];
      coords.push(polyline_obj.coords)
      if(!this.polylineExistOnMap(coords)) {

        let url = this.cesium.queryParamsHelperService.queryTerrain(params);
        if (!url) {

          that.cesium.viewer.entities.add({
            polyline: {
              show: true,
              positions: Cesium.Cartesian3.fromDegreesArray((coords[0])),
              material: Cesium.Color.LIGHTSKYBLUE
            }
          });
        }
        else{


          let latlng=[];
          for(let i=0; i<coords[0].length;i+=2){
            latlng.push([coords[0][i],coords[0][i+1],5000])
          }
          let fullPoint =[]
          latlng.forEach(function(elem){
            fullPoint.push(Cesium.Cartographic.fromDegrees(
              elem[0],elem[1],elem[2], new Cesium.Cartographic()));
          });

          let that =this;
          let res=[]
          Cesium.sampleTerrain(this.cesium.viewer.terrainProvider, 9, fullPoint)
            .then(function(samples) {
              console.log('Height in meters is: ' + samples[0].height);
              samples.forEach(function(elem){res.push(elem.longitude,elem.latitude,elem.height)})
              that.cesium.viewer.entities.add({
                polyline: {
                  show: true,
                  positions: Cesium.Cartesian3.fromDegreesArray(res),
                  material: Cesium.Color.LIGHTSKYBLUE
                }
              });
            });

/*
// Get a reference to the ellipsoid, with terrain on it.  (This API may change soon)

// Specify our point of interest.
          var pointOfInterest = Cesium.Cartographic.fromDegrees(
            -99.64592791446208, 61.08658108795938, 5000, new Cesium.Cartographic());

// [OPTIONAL] Fly the camera there, to see if we got the right point.
          this.cesium.viewer.camera.flyTo({
            destination: this.cesium.viewer.scene.globe.ellipsoid.cartographicToCartesian(pointOfInterest,
              new Cesium.Cartesian3())
          });

// Sample the terrain (async) and write the answer to the console.
          Cesium.sampleTerrain(this.cesium.viewer.terrainProvider, 9, [ pointOfInterest ])
            .then(function(samples) {
              console.log('Height in meters is: ' + samples[0].height);
            });*/



        }

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

      let exist = this.cesium.viewer.entities.values[a].polyline.positions.getValue();


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

    let that = this;
    let color;
    let colors =[];

    this.handler.setInputAction(
      function (click) {
        let pickedObject = that.cesium.viewer.scene.pick(click.position);
        let cartesian = that.cesium.viewer.scene.pickPosition(click.position);

        if (that.cesium.viewer.scene.pickPositionSupported && Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let altitude = cartographic.height;
          let altitudeString = Math.round(altitude).toString();

          that.cesium.viewer.entities.add({
            polyline : {
              positions : new Cesium.CallbackProperty(function() {
                return [cartesian, Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 9.5)];
              }, false),
              width : 2
            }
          });
          that.cesium.viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 10.0),
            label : {
              heightReference : 1,
              text : altitudeString,
              eyeOffset : new Cesium.Cartesian3(0.0, 0.0, -25.0),
              scale : 0.75
            }
          });
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.setInputAction(
      function (click) {
        if (that.drawing) {
          that.reset(color, that.positions);
        } else {
          that.polyline = that.cesium.viewer.entities.add({
            polyline : {
              positions : new Cesium.CallbackProperty(function(){
                return that.positions;
              }, false),
              material : color,
              width : 10
            }
          });

        }
        that.drawing = !that.drawing;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(
      function (movement) {
        let pickedObject = that.cesium.viewer.scene.pick(movement.endPosition);
        let length = colors.length;
        let lastColor = colors[length - 1];
        let cartesian = that.cesium.viewer.scene.pickPosition(movement.endPosition);

        if (that.cesium.viewer.scene.pickPositionSupported && Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);

          // are we drawing on the globe
          if (!Cesium.defined(pickedObject)) {
            color = Cesium.Color.BLUE;

            if (!Cesium.defined(lastColor) || !lastColor.equals(Cesium.Color.BLUE)) {
              colors.push(Cesium.Color.BLUE);
            }
            if (that.drawing) {
              if (Cesium.defined(lastColor) && lastColor.equals(Cesium.Color.BLUE)) {
                that.positions.push(cartesian);
              } else {
                that.reset(lastColor, that.positions);
                that.draw(color, that.positions);
              }
            }
          }

        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  }

   reset(color, currentPositions) {
  this.cesium.viewer.entities.add({
    polyline : {
      positions : new Cesium.CallbackProperty(function() {
        return currentPositions;
      }, false),
      material : color,
      width : 10
    }
  });
     this.cesium.queryParamsHelperService.addPolyline({coords:this.calcPositions(this.positions),color:this.cesium.positionFormService.selectedPolylineColor})
     this.positions = [];
     this.cesium.viewer.entities.remove(this.polyline);
   }

   draw(color, currentPositions) {
  this.polyline = this.cesium.viewer.entities.add({
    polyline : {
      positions : new Cesium.CallbackProperty(function() {
        return currentPositions;
      }, false),
      material : color,
      width : 10
    }
  });
}

  calcPositions(cartesianArr){
    // terrain case
    let positionArr=[];
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
    this.cesium.viewer.cesiumHandler.setInputAction(this.doubleClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //end draw polygon
  }

   leftClickInputAction(event: {position: {x: number, y: number}}): void
  {

  }

   mouseMoveInputAction(event: {endPosition: {x: number, y: number}}): void
  {

  }

   doubleClickInputAction(event: {position: {x: number, y: number}}): void
  {
    this.endDrawPolyline();
  }




   endDrawPolyline(){
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._polylineEntity.polyline.show = true;
    let that = this;


    that.queryParamsHelperService.addPolyline({coords:that.calcPositions(this._positions),color:'red'});


  }


}


