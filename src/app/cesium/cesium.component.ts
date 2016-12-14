import {Component, OnInit, transition, trigger, style, animate, state} from '@angular/core';
import {CalcService} from "../calc.service";
import {Observable} from "rxjs";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {ActivatedRoute, Params, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Promise} from 'Q';

@Component({
  host: {
    '[@routeAnimation]': "true",
    '[style.display]': "'block'",
    '[style.position]': "'absolute'",
    '[style.width]': "'100%'"
  },
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations: [
    trigger('routeAnimation', [
      state('*', style({opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate(500)
      ]),
      transition('* => void', animate(500, style({opacity: 0})))
    ])
  ]
})
export class CesiumComponent implements OnInit  {

  public viewer:any;
  public zoom:Observable<string>;
  public moveEnd:Function;
  res;

  constructor(private calcService:CalcService, private queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    setTimeout(()=> {
      console.log("res = ", this.res);
    }, 0)
    this.activatedRoute.queryParams.take(1).subscribe( (params:Params) => {
      this.initializeMap(params);
    });
  }

  initializeMap(params:Params):void {

    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq';
    this.viewer = new Cesium.Viewer('cesiumContainer');
    this.initializeQueryChanges();
    this.setMapView(params);
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

    this.moveEnd();
  }

  initializeQueryChanges():void {

    this.moveEnd = ():void => {
      let center: {lat:number, lng:number} = this.getCenter();
      if(!center) return;
      let zoom:number = this.getZoom();
      let heading:number = +Cesium.Math.toDegrees(this.viewer.camera.heading).toFixed(7);
      let pitch:number = +Cesium.Math.toDegrees(this.viewer.camera.pitch).toFixed(7);
      let roll:number = +Cesium.Math.toDegrees(this.viewer.camera.roll).toFixed(7);

      this.queryParamsHelperService.setQuery(center.lng, center.lat, zoom, this.activatedRoute, heading, pitch, roll);
    };

    this.viewer.camera.moveEnd.addEventListener(this.moveEnd);
  }

  getCurrentDistance():number {
    // if(this.viewer.scene.mode == 2) {
    //   return this.viewer.camera.positionCartographic.height / 1000;
    // } else if(this.viewer.scene.mode == 3) {
    //   return this.viewer.camera.positionCartographic.height / 1000;
    // }

    return this.viewer.camera.positionCartographic.height / 1000;

    // let cameraPosition = this.viewer.scene.camera.positionWC;
    // let ellipsoidPosition = this.viewer.scene.globe.ellipsoid.scaleToGeodeticSurface(cameraPosition);
    // let distance = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(cameraPosition, ellipsoidPosition, new Cesium.Cartesian3()));
    // return (distance/1000)
    // return this.viewer.camera.positionCartographic.height/1000
  }

  getCenter(): {lat:number, lng:number} | any {
    let lng, lat;
    lat = this.viewer.camera.positionCartographic.latitude * (180 / Math.PI);
    lng = this.viewer.camera.positionCartographic.longitude * (180 / Math.PI);
    lat = +lat.toFixed(7);
    lng = +lng.toFixed(7);
    return {lat:lat, lng:lng};
  }

  getHeight() {
    return this.viewer.camera.positionCartographic.height;
  }

  getZoom(): number | any {
    if(!this.getCenter()) return ;
    let lat:number = this.getCenter().lat;
    let metersPerPixel:number = this.getCurrentDistance();
    return +(this.calcService.distanceToZoomLevel(lat, metersPerPixel)).toFixed(7);
  }

}
