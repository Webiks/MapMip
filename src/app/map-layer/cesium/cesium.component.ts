import {Component, OnInit, transition, trigger, style, animate, state} from '@angular/core';
import {CalcService} from "../calc.service";
import {Observable, Observer} from "rxjs";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {ActivatedRoute, Params, Router, NavigationCancel, NavigationExtras} from "@angular/router";
import {CesiumCanDeactivate} from "./cesium.canDeactivate";
import {host, animations} from "../map-layer.component";
import 'rxjs/add/operator/take';


@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit  {

  public viewer:any;
  public zoom:Observable<string>;
  public moveEnd:Function;
  public skipSetMapView:boolean;
  public skipMoveEnd:boolean;


  constructor(private calcService:CalcService, private queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute, private cesiumCanDeactivate:CesiumCanDeactivate, private router:Router) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe( (params:Params) => {
      if(!this.viewer) this.initializeMap(params);
      if(!this.skipSetMapView) this.setMapView(params);
      this.skipSetMapView = false;
    });


    this.cesiumCanDeactivate.leaveCesium = new Observable<boolean>((observer:Observer<boolean>) => {
      this.flyToCenterAndGetBounds().subscribe((bool:boolean) => {
        observer.next(bool)
      })
    });
    // filter(e => e instanceof NavigationCancel).
    this.router.events.subscribe(e=>{
      console.log(e)
    //   let state:string = e.url.split('?')[0];
    //
    //   let center: {lat:number, lng:number} = this.getCenter();
    //   let lat:number = center.lat;
    //   let lng:number = center.lng;
    //   let zoom:number = this.getZoom();
    //
    //   let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery(lng, lat, zoom, );
    //
    //   this.router.navigate([state], navigationExtras);
    })
  };

  initializeMap(params:Params):void {
    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq';
    let dim:number = this.queryParamsHelperService.queryDim(params);
    this.viewer = new Cesium.Viewer('cesiumContainer', {sceneMode: dim});
    window['viewer'] = this.viewer;
    this.initializeQueryChanges();
  }

  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params);
    let latitude:number = this.queryParamsHelperService.queryLat(params);
    let zoom:number = this.queryParamsHelperService.queryZoom(params);
    let height = this.calcService.zoomLevelToDistance(latitude, zoom) * 1000;
    let headingRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(params));
    let pitchRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryPitch(params));
    let rollRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryRoll(params));

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
  }


  initializeQueryChanges():void {

    this.moveEnd = ():any => {

      if(this.skipMoveEnd) return;

      let center: {lat:number, lng:number} = this.getCenter();
      if(!center) return;
      let lat:number = center.lat;
      let lng:number = center.lng;
      let zoom:number = this.getZoom();
      let heading:number = +Cesium.Math.toDegrees(this.viewer.camera.heading);//.toFixed(7);
      let pitch:number = +Cesium.Math.toDegrees(this.viewer.camera.pitch);//.toFixed(7);
      let roll:number = +Cesium.Math.toDegrees(this.viewer.camera.roll);//.toFixed(7);
      let dim:number = this.viewer.scene.mode;
      let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery(lng, lat, zoom, heading, pitch, roll, dim);

      return this.router.navigate([], navigationExtras).then((res) => {
        this.skipSetMapView = true;
        return res;
      });
    };

    this.viewer.camera.moveEnd.addEventListener(this.moveEnd);
  }

  getCurrentDistance():number {
    return this.viewer.camera.positionCartographic.height / 1000;
  }

  getCenter(): {lat:number, lng:number} | any {
    let lng, lat;
    lat = this.viewer.camera.positionCartographic.latitude * (180 / Math.PI);
    lng = this.viewer.camera.positionCartographic.longitude * (180 / Math.PI);
    lat = +lat.toFixed(7);
    lng = +lng.toFixed(7);
    return {lat:lat, lng:lng};
  }


  getZoom(): number | any {
    if(!this.getCenter()) return ;
    let lat:number = this.getCenter().lat;
    let metersPerPixel:number = this.getCurrentDistance();
    return +(this.calcService.distanceToZoomLevel(lat, metersPerPixel)).toFixed(7);
  }

  flyToCenterAndGetBounds() {

    const headingDeg = Cesium.Math.toDegrees(this.viewer.camera.heading);
    const pitchDeg = Cesium.Math.toDegrees(this.viewer.camera.pitch);
    const rollDeg = Cesium.Math.toDegrees(this.viewer.camera.roll);

    if( headingDeg % 360 === 0 && pitchDeg === -90 && rollDeg % 360 === 0 ) {
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
            hasNotFlown = true;
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

}
