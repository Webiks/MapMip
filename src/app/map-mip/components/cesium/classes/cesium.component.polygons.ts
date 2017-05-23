 /**
 * Created by USSeR on 5/18/2017.
 */
 import {Params} from "@angular/router";
 import {CesiumComponent} from "../cesium.component";
 import * as _ from "lodash";
 import {isFunction, isUndefined} from "util";
 import {QueryParamsHelperService} from "../../../services/query-params-helper.service";

 export class CesiumPolygons{
   queryParamsSubscriber;
   public _polygonEntity;
   public _positions:Array<any>=[]; //TODO: should be on the url
   public polygon_id=0;

   constructor(private cesium: CesiumComponent,private queryParamsHelperService: QueryParamsHelperService){
     this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
     cesium.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
     if(cesium.positionFormService.onPolygonPicked) this.togglePolygonPicker.bind(this)(true);
   }
   destroy() {
     this.queryParamsSubscriber.unsubscribe();
     this.cesium.viewer.cesiumHandler.destroy();
   }

   queryParams(params: Params) {
     let params_changes:boolean = this.cesium.queryParamsHelperService.anyPolygonsChange(this.cesium.prevParams, this.cesium.currentParams);
     if(params_changes ) {
       this.setPolygonChanges(params);
     }
   }
   setPolygonChanges(params:Params):void{
     let params_polygons:Array<any> = this.cesium.queryParamsHelperService.queryPolygons(params);
     let that =this;
     params_polygons.forEach((polygon)=>{
      that.queryParamsHelperService.addPolygon(polygon);
     });

   }





   togglePolygonPicker(){
    console.log("do cesium polygon");
     this._positions=[];

     this._polygonEntity= this.cesium.viewer.entities.add({
       id: this.polygon_id+=1,
       name : 'PolygonDrawer'+this.polygon_id,
       polyline: {
         show: true,
         positions: this.setCallbackProperty(this._positions),
         material : Cesium.Color.RED
       },
       polygon : {
         hierarchy: this.setCallbackProperty(this._positions),
         material : Cesium.Color.RED
       }
     });
     this.initDrawer()
   }
   calcPositions(cartesianArr){
     // terrain case
     var positionArr=[];
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
     _.forEach(cartesianArr,function (cartesian,index) {
       let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
       let latDeg: number = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
       let lngDeg: number  = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
       positionArr.push(latDeg,lngDeg)
     });
      positionArr.splice(positionArr.length-4, 4) //remove redundant points from double click
     return positionArr;

   }

   initDrawer()
   {
     this.cesium.viewer.cesiumHandler= new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.scene.canvas);
     this.cesium.viewer.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
     this.cesium.viewer.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
     this.cesium.viewer.cesiumHandler.setInputAction(this.doubleClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //end draw polygon
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


       that.queryParamsHelperService.addPolygon(that.calcPositions(this._positions));


     //this.polygonDrawerEnded.emit(this._positions);
     // this.resetPolygon();
   }

   private resetPolygon()
   {
     this._positions.length=0;
     this._polygonEntity.polyline.show = false;
     this._polygonEntity.polygon.show = false;

     if(!isUndefined(this.cesium.viewer.cesiumHandler))
     {
       this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
       this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
       this.cesium.viewer.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
     }
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


