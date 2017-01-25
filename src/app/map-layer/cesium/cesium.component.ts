import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {
  ActivatedRoute, Params, Router, NavigationExtras, UrlTree, NavigationEnd,
  NavigationStart
} from "@angular/router";
import {host, animations} from "../map-layer.component";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";
import "cesium/Build/Cesium/Cesium.js";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";
import {Layers} from "./cesium.component.layers";
import {Markers} from "./cesium.component.markers";
import {PositionFormService} from "../position-form/position-form.service";

@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit,OnDestroy, MapLayerChild  {

  ngOnDestroy(): void {
    this.markers.cesiumHandler.destroy();
  }

  @ViewChild('cesiumContainer') public cesiumContainer:ElementRef;

  public viewer:any;
  public prevParams:Params = {};
  public currentParams:Params = {};
  public queryParamsSubscriber;
  public go_north:boolean = false;
  public layers:Layers;
  public markers:Markers;
  not_allowed = true;
  constructor(public queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute, private generalCanDeactivateService:GeneralCanDeactivateService, private router:Router, public calcService:CalcService, public positionFormService:PositionFormService) {window['current'] = this;}

  ngOnInit() {
    this.initializeMap();
    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.generalCanDeactivateService.onLeave =  Observable.create((observer:Observer<boolean>) => this.onLeave(observer)) ;
    this.router.events.filter(event => event instanceof NavigationStart && event.url.includes("/leaflet")).take(1).subscribe(() => {this.go_north = true });
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/cesium", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd);
    this.positionFormService.markerPickerEmitter.subscribe(this.markers.toggleMarkerPicker.bind(this.markers));
    if(this.positionFormService.onPicked) this.markers.toggleMarkerPicker.bind(this.markers)(true);
  };

  setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event:NavigationEnd):void => {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };

  onLeave(observer:Observer<boolean>):void {
    this.viewer.camera.moveEnd._listeners.pop();
    this.queryParamsSubscriber.unsubscribe();
    this.flyToCenterAndGetBounds().subscribe((bool:boolean) => {
      observer.next(bool);
    })
  };

  queryParams(params:Params):void {
    this.prevParams = this.currentParams;
    this.currentParams = params;

    //layers
    if(this.queryParamsHelperService.anyLayersChanges(this.prevParams, this.currentParams) || this.layers.noTileLayer()) {
      this.layers.setLayersChanges(params);
    }

    //view
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if(this.anyParamChanges(params)){
      this.setMapView(params);
    }

    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, this.currentParams);
    let map_changes:boolean = this.markers.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.markers.setMarkersChanges(params);
    }
  };

  initializeMap():void {
    this.viewer = new Cesium.Viewer(this.cesiumContainer.nativeElement , {
      baseLayerPicker : false
    });
    this.viewer.camera.moveEnd.addEventListener(this.moveEnd.bind(this));
    this.markers = new Markers(this);
    this.layers = new Layers(this);

  }


  anyParamChanges(params:Params):boolean {

    let longitudeP:number       = this.queryParamsHelperService.queryLng(params)// || this.getCenter().lng;
    let latitudeP:number        = this.queryParamsHelperService.queryLat(params)// || this.getCenter().lat;
    let heightP:number          = this.queryParamsHelperService.queryHeight(params)// || this.viewer.camera.positionCartographic.height;
    let headingRadiansP:number  = this.queryParamsHelperService.queryHeading(params) % 360;
    let pitchRadiansP:number    = this.queryParamsHelperService.queryPitch(params) % 360;
    let rollRadiansP:number     = this.queryParamsHelperService.queryRoll(params) % 360;
    let mode3dP:number          = this.queryParamsHelperService.queryMode3d(params);
    let rotateP:number          = this.queryParamsHelperService.queryRotate(params);

    let arrayP:Array<number> = [longitudeP, latitudeP, heightP, headingRadiansP, pitchRadiansP, rollRadiansP, mode3dP, rotateP];

    let longitude:number        = this.getCenter().lng;
    let latitude:number         = this.getCenter().lat;
    let height:number           = this.viewer.camera.positionCartographic.height;
    let headingRadians:number   = +Cesium.Math.toDegrees(this.viewer.camera.heading) % 360;
    let pitchRadians:number     = +Cesium.Math.toDegrees(this.viewer.camera.pitch) % 360;
    let rollRadians:number      = +Cesium.Math.toDegrees(this.viewer.camera.roll) % 360;
    let mode3d:number           = this.viewer.scene.mode == Cesium.SceneMode.SCENE3D ? 1 : 0;
    let rotate:number;

    if(this.viewer.scene.mode == Cesium.SceneMode.SCENE3D || this.viewer.scene._mapMode2D == 1){
      rotate = NaN;
    } else {
      rotate = 1
    }
    let array = [longitude, latitude, height, headingRadians, pitchRadians, rollRadians, mode3d, rotate];

    arrayP = this.calcService.toFixes7Obj(arrayP);
    array = this.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array)
  }

  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params) || this.getCenter().lng;
    let latitude:number  = this.queryParamsHelperService.queryLat(params) || this.getCenter().lat;
    let height           = this.queryParamsHelperService.queryHeight(params) || this.viewer.camera.positionCartographic.height;
    let headingRadians   = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(params));
    let pitchRadians     = Cesium.Math.toRadians(this.queryParamsHelperService.queryPitch(params));
    let rollRadians      = Cesium.Math.toRadians(this.queryParamsHelperService.queryRoll(params));
    let mode3d:number    =  this.queryParamsHelperService.queryMode3d(params);
    let rotate:number    =  isNaN(this.queryParamsHelperService.queryRotate(params)) ? 1 : 0;

    this.viewer.scene.mode = mode3d == 0 ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D;
    this.viewer.scene._mapMode2D = rotate;

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


  moveEnd(e?):Promise<boolean> {
    if(!this.anyParamChanges(this.currentParams)) return;

    let center: {lat:number, lng:number} = this.getCenter();
    if(!center) return;
    let lat:number = center.lat;
    let lng:number = center.lng;
    let height:number = this.viewer.camera.positionCartographic.height;//.toFixed(7);
    let heading:number = +Cesium.Math.toDegrees(this.viewer.camera.heading);//.toFixed(7);

    let pitch:number = +Cesium.Math.toDegrees(this.viewer.camera.pitch);//.toFixed(7);
    let roll:number = +Cesium.Math.toDegrees(this.viewer.camera.roll);//.toFixed(7);
    let mode3d:number = this.viewer.scene.mode == Cesium.SceneMode.SCENE2D ? 0 : 1;
    let markers = this.currentParams['markers'];
    let layers = this.currentParams['layers'];
    let rotate = this.currentParams['rotate'];

    rotate = this.viewer.scene.mode != Cesium.SceneMode.SCENE2D || rotate != 1 ? undefined : 1;
    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, mode3d, markers, rotate, layers});
    return this.router.navigate([], navigationExtras);

  };

  getCenter(): {lat:number, lng:number} | any {
    let lat = Cesium.Math.toDegrees(this.viewer.camera.positionCartographic.latitude);
    let lng = Cesium.Math.toDegrees(this.viewer.camera.positionCartographic.longitude);
    return this.calcService.toFixes7Obj({lat:lat, lng:lng});
  }

  flyToCenterAndGetBounds() {
    this.viewer.scene._mapMode2D == 0

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
        let heading = this.viewer.camera.heading;

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
            heading: this.go_north ? 0 : heading ,
            pitch: Cesium.Math.toRadians(-90.0), //look down
            roll: 0.0 //no change
          },
          duration: 0.5,
          complete: () => {
            obs.next(true);
          }
        };
        that.viewer.camera.flyTo(flyToObj);
      });
    }
  }

  drawBounds() {
    let rec = {
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(...this.getBounds()),
        material: new Cesium.StripeMaterialProperty({
          evenColor: Cesium.Color.WHITE,
          oddColor: Cesium.Color.BLUE,
          repeat: 5
        })
      }
    }
    this.viewer.entities.add(rec);
  }

  getBounds():[number,number,number,number] {

    let current_mode:number = this.viewer.scene.mode;
    let current_heading:number = this.viewer.camera.heading;
    let current_mapMode2D:number = this.viewer.scene.mapMode2D;

    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    this.viewer.scene._mapMode2D = 0;

    this.viewer.camera.setView({
      orientation: {
        heading : 0
      }
    });

    let bounds: [number,number,number,number] = this.calcBounds();
    bounds = <[number,number,number,number]> bounds.map( (value:number) => Cesium.Math.toDegrees(value));
    // let bounds: [number,number,number,number] = this.viewer.camera.computeViewRectangle();
    // if(isUndefined(bounds)) bounds = this.calcBounds();

    this.viewer.scene.mode = current_mode;
    this.viewer.scene._mapMode2D = current_mapMode2D;

    this.viewer.camera.setView({
      orientation: {
        heading : current_heading
      }
    });

    return bounds;

  }

  calcBounds() : [number,number,number,number] {
    let bounds:[number,number,number,number];

    let leftTopCartesian2 = new Cesium.Cartesian2(0, 0);
    let leftTopCartesian3 = this.viewer.camera.pickEllipsoid(leftTopCartesian2);
    let rightBottomCartesian2  = new Cesium.Cartesian2(this.viewer.canvas.width, this.viewer.canvas.height);
    let rightBottomCartesian3 = this.viewer.camera.pickEllipsoid(rightBottomCartesian2);

    if(_.isEmpty(leftTopCartesian3) || _.isEmpty(rightBottomCartesian3)) {
      let o_bounds = this.viewer.camera.computeViewRectangle();
      return [o_bounds.west, o_bounds.north, o_bounds.east, o_bounds.south];
    }
    let cartographicLeftTop = Cesium.Cartographic.fromCartesian(leftTopCartesian3);
    let cartographicRightBottom = Cesium.Cartographic.fromCartesian(rightBottomCartesian3);
    bounds = [cartographicRightBottom.longitude, cartographicLeftTop .latitude, cartographicLeftTop .longitude, cartographicRightBottom.latitude];

    return bounds;
  }

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
    let heading:number = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(params));

    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(...bounds),
      orientation: {
        heading: heading
      }
    });

  }

}
