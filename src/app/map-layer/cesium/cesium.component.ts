import {Component, OnInit} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {ActivatedRoute, Params, Router, NavigationExtras, UrlTree, NavigationEnd} from "@angular/router";
import {CesiumCanDeactivate} from "./cesium.canDeactivate";
import {host, animations} from "../map-layer.component";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";
import {isUndefined} from "util";

@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit, MapLayerChild  {

  public viewer:any;
  public currentParams:Params;
  public marker;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute, private cesiumCanDeactivate:CesiumCanDeactivate, private router:Router) {window['current'] = this;window['cesiumComp'] = CesiumComponent }

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams);
    this.cesiumCanDeactivate.leaveCesium = Observable.create(this.leaveCesium);
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/cesium", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd);
  };

  setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event:NavigationEnd):void => {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };

  leaveCesium: (Observer) => void = (observer:Observer<boolean>):void => {
    this.viewer.camera.moveEnd.removeEventListener(this.moveEnd);
    this.flyToCenterAndGetBounds().subscribe((bool:boolean) => {
      observer.next(true);
    })
  };

  queryParams: (Params) => void = (params:Params):void => {
    console.log(this.queryParamsHelperService.queryMarkers(params));

    this.currentParams = params;
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
      this.setMapBounds(bounds);
    } else if(this.anyParamChanges(params)){
      this.setMapView(params);
    }
  };

  initializeMap():void {
    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq';
    this.viewer = new Cesium.Viewer('cesiumContainer');
    window['viewer'] = this.viewer;
    this.viewer.camera.moveEnd.addEventListener(this.moveEnd);
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

    let markerP:[number,number, number] | any = this.queryParamsHelperService.queryMarkers(params)
    let marker_exist:boolean = this.markerExist(markerP);

    return !_.isEqual(arrayP, array) || !marker_exist;
  }

  markerExist(marker:[number,number, number]):boolean {
    let current_marker_radian_position = Cesium.Cartesian3.fromDegrees(...marker);
    let marker_positions = this.getMarkersPosition();
    let exist_point = marker_positions.find((positionArray) => _.isEqual(positionArray, current_marker_radian_position));
    // console.log("exist_point" + exist_point);
    return !isUndefined(exist_point);
  }

  getMarkersPosition() {
    let points = this.viewer.entities.values.filter( (one) => one.point );
    let degreesPositions = points.map( (entity) => {
      return entity.position.getValue();
    });

    return degreesPositions;
  }

  getParseQueryMarkersPosition() {
    let markerPositions = this.getMarkersPosition();

    let convertedMarkerPositions = markerPositions.map((cartesian) => {
      let cartographicRadian = Cesium.Cartographic.fromCartesian(cartesian);
      cartographicRadian.latitude = Cesium.Math.toDegrees(cartographicRadian.latitude)
      cartographicRadian.longitude = Cesium.Math.toDegrees(cartographicRadian.longitude)
      return [cartographicRadian.longitude, cartographicRadian.latitude, cartographicRadian.height]
    });

    convertedMarkerPositions.forEach((arr) => {
      arr.toString = ():string => {
        if(arr.length == 0) return "";
        let str = "(";
        arr.forEach((one, index) => str += (one.toString() + (index + 1 == arr.length ? ")" : ",")))
        return str;
      };
    });

    return convertedMarkerPositions;
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
    let marker = this.queryParamsHelperService.queryMarkers(params);
    if(marker) this.setMarker(marker);
  }

  setMarker(marker:[number, number, number]):void {
    debugger

    let points = this.viewer.entities.values.map((entity) => entity.point);

    this.viewer.entities.add({
      position : Cesium.Cartesian3.fromDegrees(...marker),
      point: {
        color : Cesium.Color.LIME,
        pixelSize : 20
      }
    });
  }

  moveEnd: () => Promise<boolean> = ():Promise<boolean> => {
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
    let getMarkersPosition = this.getMarkersPosition();
    let getParseQueryMarkersPosition = this.getParseQueryMarkersPosition();
    debugger
    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, dim});

    return this.router.navigate([], navigationExtras);

  };

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
      let position, that = this;
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


  getBounds() : [number,number,number,number]{

    let current_mode = this.viewer.scene.mode;
    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;

    let bounds: [number,number,number,number] = this.viewer.camera.computeViewRectangle();
    if(isUndefined(bounds)) bounds = this.calcBounds();
    bounds = <[number,number,number,number]>_.map(bounds, value => Cesium.Math.toDegrees(value));

    this.viewer.scene.mode = current_mode;

    return bounds;

  }

  private calcBounds() : [number,number,number,number] {
    let bounds:[number,number,number,number];

    let leftTopCartesian2 = new Cesium.Cartesian2(0, 0);
    let leftTopCartesian3 = this.viewer.camera.pickEllipsoid(leftTopCartesian2);
    let rightBottomCartesian2  = new Cesium.Cartesian2(this.viewer.canvas.width, this.viewer.canvas.height);
    let rightBottomCartesian3 = this.viewer.camera.pickEllipsoid(rightBottomCartesian2);

    let cartographicLeftTop = Cesium.Cartographic.fromCartesian(leftTopCartesian3);
    let cartographicRightBottom = Cesium.Cartographic.fromCartesian(rightBottomCartesian3);

    if(cartographicLeftTop && cartographicRightBottom){
      bounds = [cartographicRightBottom.longitude, cartographicLeftTop .latitude, cartographicLeftTop .longitude, cartographicRightBottom.latitude];
    } else {
      bounds = [0, 0, 0, 0];
    }

    return bounds;
  }

  setMapBounds(bounds:[number, number, number, number]):void {
    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(...bounds)
    });
  }


}
