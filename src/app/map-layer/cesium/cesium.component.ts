import {Component, OnInit} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {ActivatedRoute, Params, Router, NavigationExtras} from "@angular/router";
import {CesiumCanDeactivate} from "./cesium.canDeactivate";
import {host, animations} from "../map-layer.component";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";

@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit, MapLayerChild  {

  public viewer:any;
  public zoom:Observable<string>;
  public moveEnd:Function;
  public currentParams:Params;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute, private cesiumCanDeactivate:CesiumCanDeactivate, private router:Router) { }

  ngOnInit() {

    this.initializeMap();

    this.activatedRoute.queryParams.subscribe( (params:Params) => {
      this.currentParams = params;
      if(this.queryParamsHelperService.hasBounds()){
        this.setMapBounds();
      } else if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    });


    this.cesiumCanDeactivate.leaveCesium = new Observable<boolean>((observer:Observer<boolean>) => {

      this.viewer.camera.moveEnd.removeEventListener(this.moveEnd);

      this.flyToCenterAndGetBounds().subscribe((bool:boolean) => {
          this.queryParamsHelperService.setBounds(this.getBounds());
          observer.next(true);
      })

    });

  };

  initializeMap():void {
    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq';
    this.viewer = new Cesium.Viewer('cesiumContainer');
    window['viewer'] = this.viewer;
    this.initializeMoveend();
  }

  anyParamChanges(params:Params):boolean {
    let longitudeP:number       = this.queryParamsHelperService.queryLng(params)// || this.getCenter().lng;
    let latitudeP:number        = this.queryParamsHelperService.queryLat(params)// || this.getCenter().lat;
    let heightP:number          = this.queryParamsHelperService.queryHeight(params)// || this.viewer.camera.positionCartographic.height;
    let headingRadiansP:number  = this.queryParamsHelperService.queryHeading(params) % 360;
    let pitchRadiansP:number    = this.queryParamsHelperService.queryPitch(params) % 360;
    let rollRadiansP:number     = this.queryParamsHelperService.queryRoll(params) % 360;
    let dimP:number             =  this.queryParamsHelperService.queryDim(params);

    let arrayP = [longitudeP, latitudeP, heightP, headingRadiansP, pitchRadiansP, rollRadiansP, dimP];

    let longitude:number        = this.getCenter().lng;
    let latitude:number         = this.getCenter().lat;
    let height:number           = this.viewer.camera.positionCartographic.height;
    let headingRadians:number   = +Cesium.Math.toDegrees(this.viewer.camera.heading) % 360;
    let pitchRadians:number     = +Cesium.Math.toDegrees(this.viewer.camera.pitch) % 360;
    let rollRadians:number      = +Cesium.Math.toDegrees(this.viewer.camera.roll) % 360;
    let dim:number              = this.viewer.scene.mode;

    let array = [longitude, latitude, height, headingRadians, pitchRadians, rollRadians, dim];

    arrayP.forEach( (value, index) => {arrayP[index] = +arrayP[index].toFixed(7)});
    array.forEach( (value, index) => {array[index] = +array[index].toFixed(7)});
    return !_.isEqual(arrayP, array);
  }

  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params) || this.getCenter().lng;
    let latitude:number = this.queryParamsHelperService.queryLat(params) || this.getCenter().lat;
    let height = this.queryParamsHelperService.queryHeight(params) || this.viewer.camera.positionCartographic.height;
    let headingRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(params));
    let pitchRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryPitch(params));
    let rollRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryRoll(params));
    let dim:number =  this.queryParamsHelperService.queryDim(params);

    this.viewer.camera.setView({
      destination : Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      ),
      orientation: {
        heading: headingRadians,
        pitch: pitchRadians,
        roll: rollRadians
      }
    });

    this.viewer.scene.mode = (dim == 2 || dim == 3) ? dim : 3 ;

  }


  initializeMoveend():void {
    this.moveEnd = ():any => {
      if(!this.anyParamChanges(this.currentParams)) return;
      let center: {lat:number, lng:number} = this.getCenter();
      if(!center) return;
      let lat:number = center.lat;
      let lng:number = center.lng;
      let height:number = this.viewer.camera.positionCartographic.height;//.toFixed(7);
      let heading:number = +Cesium.Math.toDegrees(this.viewer.camera.heading);//.toFixed(7);
      let pitch:number = +Cesium.Math.toDegrees(this.viewer.camera.pitch);//.toFixed(7);
      let roll:number = +Cesium.Math.toDegrees(this.viewer.camera.roll);//.toFixed(7);
      let dim:number = this.viewer.scene.mode;

      let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, dim});
      return this.router.navigate([], navigationExtras);
    };

    this.viewer.camera.moveEnd.addEventListener(this.moveEnd);
  }

  getCenter(): {lat:number, lng:number} | any {
    let lng, lat;
    lat = this.viewer.camera.positionCartographic.latitude * (180 / Math.PI);
    lng = this.viewer.camera.positionCartographic.longitude * (180 / Math.PI);
    lat = +lat.toFixed(7);
    lng = +lng.toFixed(7);
    return {lat:lat, lng:lng};
  }

  flyToCenterAndGetBounds() {
    const headingDeg = Cesium.Math.toDegrees(this.viewer.camera.heading);
    const pitchDeg = Cesium.Math.toDegrees(this.viewer.camera.pitch);
    const rollDeg = Cesium.Math.toDegrees(this.viewer.camera.roll);

    let on_d3 = headingDeg % 360 === 0 && pitchDeg === -90 && rollDeg % 360 === 0;
    let on_d2 = this.viewer.scene.mode == Cesium.SceneMode.SCENE2D;

    if(on_d3 || on_d2) {
      return Observable.of(true);
    }

    else {
      let position, hasNotFlown:boolean = false, that = this;
      return new Observable<any>(obs => {

        if (Math.cos(that.viewer.camera.pitch) < 0.001){
          position = that.viewer.camera.position;
        }
        else{
          try {
            let rect = that.viewer.canvas.getBoundingClientRect();

            let center = new Cesium.Cartesian2(rect.width / 2, rect.height / 2);
            position = that.viewer.camera.pickEllipsoid(center, that.viewer.scene.globe.ellipsoid);

            let cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = that.viewer.camera.positionCartographic.height;

            position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
          }
          catch(err){
            position = that.viewer.camera.position;
          }
        }

        let flyToObj = {
          destination: position,
          easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          orientation: {
            heading: 0.0, //go north
            pitch: Cesium.Math.toRadians(-90.0), //look down
            roll: 0.0 //no change
          },
          duration: 0.5,
          complete: () => {
            obs.next(true);
          }
        };
        that.viewer.scene.camera.flyTo(flyToObj);
      });
    }
  }


  // getBounds() : Promise<[number,number,number,number]>{
  //   let promise = new Promise((res, rej)=> {
  //     this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
  //
  //     var c2 = new Cesium.Cartesian2(0, 0);
  //     let leftTop  = this.viewer.scene.camera.pickEllipsoid(c2, this.viewer.scene.globe.ellipsoid);
  //     c2 = new Cesium.Cartesian2(this.viewer.scene.canvas.width, this.viewer.scene.canvas.height, 0);
  //     let rightDown = this.viewer.scene.camera.pickEllipsoid(c2, this.viewer.scene.globe.ellipsoid);
  //
  //     // this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  //
  //     if (leftTop != undefined && rightDown != undefined) {
  //       leftTop = Cesium.Cartographic.fromCartesian(leftTop);
  //       rightDown = Cesium.Cartographic.fromCartesian(rightDown);
  //       if (leftTop == undefined || rightDown == undefined) {
  //         res([0,0,0,0]);
  //       }
  //
  //       let bounds1 = this.viewer.camera.computeViewRectangle();
  //
  //       forEach(bounds1, (val, key) => {
  //         bounds1[key] = Cesium.Math.toDegrees(val)
  //       });
  //
  //       res(bounds1);
  //
  //       console.log("bounds1 = ", bounds1);
  //       console.log("bounds2 = ", [Cesium.Math.toDegrees(rightDown.longitude), Cesium.Math.toDegrees(leftTop.latitude), Cesium.Math.toDegrees(leftTop.longitude), Cesium.Math.toDegrees(rightDown.latitude)]);
  //
  //       this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  //
  //       res([Cesium.Math.toDegrees(rightDown.longitude), Cesium.Math.toDegrees(leftTop.latitude), Cesium.Math.toDegrees(leftTop.longitude), Cesium.Math.toDegrees(rightDown.latitude)]);
  //     }
  //
  //   });
  //
  //   return promise;
  // }

  getBounds() : [number,number,number,number]{
    let current_mode = this.viewer.scene.mode;

    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;

    let bounds = this.viewer.camera.computeViewRectangle();

    bounds = _.map(bounds, value => Cesium.Math.toDegrees(value));

    this.viewer.scene.mode = current_mode;

    return bounds;
  }

  setMapBounds() {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.getBounds();

    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(...bounds)
    });

    // this.moveEnd();

    this.queryParamsHelperService.resetBounds();
  }

}
