 /**
 * Created by USSeR on 5/18/2017.
 */
 import {Params} from "@angular/router";
 import {CesiumComponent} from "../cesium.component";
 import * as _ from "lodash";
 import {isFunction, isUndefined} from "util";
 import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
 import {AppState} from '../../../app.store';

 export class CesiumPolygons{
   queryParamsSubscriber;
   public _polygonEntity;
   public _positions:Array<any>=[];
   constructor(private cesium: CesiumComponent,private queryParamsHelperService: QueryParamsHelperService){
     this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
     cesium.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    // if(cesium.positionFormService.onPolygonPicked) this.togglePolygonPicker.bind(this)(true);
   }
   destroy() {
     this.queryParamsSubscriber.unsubscribe();
     this.cesium.positionFormService.polygonPickerEmitter.unsubscribe();
     this.cesium.viewer.cesiumHandler.destroy();
   }

   queryParams(params: Params) {
     let params_changes:boolean = this.cesium.queryParamsHelperService.anyPolygonsChange(this.cesium.prevParams, this.cesium.currentParams);
     if( params_changes ) {
       this.setPolygonChanges(params);
     }

   }
   setPolygonChanges(params:Params):void{
     let params_polygons_array: Array<Object> = this.cesium.queryParamsHelperService.queryPolygons(params);
     this.addPolygonsViaUrl(params_polygons_array);
   }

   addPolygonsViaUrl(params_polygons_array: any[]) {
     const polygonsOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polygon']);

     polygonsOnMap.forEach(polygon_obj => {
       this.cesium.viewer.entities.remove(polygon_obj);
     })

     let that =this;
     params_polygons_array.forEach(polygon_obj => {
       let coords = [];
         coords.push(polygon_obj.coords)
       if(!this.polygonsExistOnMap(coords)) {
           that.cesium.viewer.entities.add({
             polygon : {
               hierarchy : Cesium.Cartesian3.fromDegreesArray(coords[0]),
               material : Cesium.Color.LIGHTSKYBLUE.withAlpha(0.2),
               extrudedHeight: 0,
               outline : true,
               outlineColor : this.getColor(polygon_obj.color)
            }
         });
       }
     });
   }
   polygonsExistOnMap(coords):boolean {
     //no entities on map - don't check:
    const polygonsOnMap = _.filter(this.cesium.viewer.entities.values, (ent) => ent['polygon']);
      if (polygonsOnMap.length==0)
      return false;

     for (let a = 0; a < this.cesium.viewer.entities.values.length; a++) {
       if (this.cesium.viewer.entities.values[a].polygon) {
       var exist = this.cesium.viewer.entities.values[a].polygon.hierarchy.getValue();
       for (let i = 0; i < exist.positions.length; i++) {
         let lng = Cesium.Cartographic.fromCartesian(exist.positions[i]).longitude;
         let lngDeg = Cesium.Math.toDegrees(lng);
         let lngFixed = lngDeg.toFixed(7);

         let lat = Cesium.Cartographic.fromCartesian(exist.positions[i]).latitude;
         let latDeg = Cesium.Math.toDegrees(lat)
         let latFixed = latDeg.toFixed(7);

         if (lngFixed !== coords[0][(2 * i)] || latFixed !== coords[0][(2 * i) + 1])
           return false;
       }
     }
   }
     return true;
   }

   getColor(color:string){
     switch (color){
       case  'red':
             return Cesium.Color.RED;
       case  'blue':
         return Cesium.Color.BLUE;
       case  'green':
         return Cesium.Color.GREEN;
       case  'yellow':
         return Cesium.Color.YELLOW;
       case  'grey':
         return Cesium.Color.GREY;
       case  'white':
         return Cesium.Color.WHITE;
       case  'black':
         return Cesium.Color.BLACK;
       case  'purple':
         return Cesium.Color.PURPLE;
       case  'orange':
         return Cesium.Color.ORANGE;
       default:
          Cesium.Color.BLUE;

     }
   }

   togglePolygonPicker(){
     this._positions=[];

     this._polygonEntity= this.cesium.viewer.entities.add({
       polyline: {
         show: true,
         positions: this.setCallbackProperty(this._positions),
         material :  Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5)
       },
       polygon : {
         hierarchy: this.setCallbackProperty(this._positions),
         material : Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5),
         outline : true,
         outlineColor :  Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5)
       }
     });

     this.initDrawer()
   }
   calcPositions(cartesianArr){
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

     this._polygonEntity.polyline.show = true;
     this._polygonEntity.polygon.show = false;

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
   }

   private endDrawPolygon(){
     this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
     this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
     this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

     this._polygonEntity.polyline.show = false;
     this._polygonEntity.polygon.show = true;
     let that = this;
       that.queryParamsHelperService.addPolygon({coords:that.calcPositions(this._positions),color:this.cesium.positionFormService.selectedPolylgonColor});

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


