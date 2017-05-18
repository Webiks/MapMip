 /**
 * Created by USSeR on 5/18/2017.
 */
 import {Params} from "@angular/router";
 import {CesiumComponent} from "../cesium.component";
 import * as _ from "lodash";
 import {isFunction, isUndefined} from "util";

 export class CesiumPolygons{
   public queryParamsSubscriber;
   public _polygonEntity;
   public _positions:Array<any>=[]; //TODO: should be on the url

   constructor(private cesium: CesiumComponent){
     this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
     cesium.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
     if(cesium.positionFormService.onPolygonPicked) this.togglePolygonPicker.bind(this)(true);
   }

   queryParams(params: Params) {
     let params_changes:boolean = this.cesium.queryParamsHelperService.anyPolygonsChange(this.cesium.prevParams, this.cesium.currentParams);
     //let map_changes:boolean = this.anyMarkersMapChanges(params);

   }
   togglePolygonPicker(){
    console.log("do cesium polygon");
     this._polygonEntity= this.cesium.viewer.entities.add({
       id: 'PolygonDrawer',
       name : 'PolygonDrawer',
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

     //this.polygonDrawerEnded.emit(this._positions);
     // this.resetPolygon();
   }

   /*private resetPolygon()
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
   }*/

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


