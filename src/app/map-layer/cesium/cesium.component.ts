import {Component, OnInit} from '@angular/core';
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
import {isUndefined} from "util";
import "cesium/Build/Cesium/Cesium.js";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";

@Component({
  host: host,
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
  animations:animations
})

export class CesiumComponent implements OnInit, MapLayerChild  {
  anyParamChanges(Params): boolean {
    return undefined;
  }

  public viewer:any;
  public prevParams:Params = {};
  public currentParams:Params = {};
  public queryParamsSubscriber;
  public go_north:boolean = false;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private activatedRoute:ActivatedRoute, private generalCanDeactivateService:GeneralCanDeactivateService, private router:Router, private calcService:CalcService) {window['current'] = this;}

  ngOnInit() {
    this.initializeMap();
    this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams);
    this.generalCanDeactivateService.onLeave = this.onLeave();
    this.router.events.filter(event => event instanceof NavigationStart && event.url.includes("/leaflet")).take(1).subscribe(() => {this.go_north = true });
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/cesium", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd);
  };

  setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event:NavigationEnd):void => {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };

  onLeave():Observable<boolean> {
    return Observable.create((observer:Observer<boolean>) => {
      this.viewer.camera.moveEnd.removeEventListener(this.moveEnd);
      this.queryParamsSubscriber.unsubscribe();
      this.flyToCenterAndGetBounds().subscribe((bool:boolean) => {
        observer.next(bool);
      })
    });
  };

  queryParams: (Params) => void = (params:Params):void => {
    this.prevParams = this.currentParams;
    this.currentParams = params;

    //view
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if(this.anyViewChanges(params)){
      this.setMapView(params);
    }

    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params);
    let map_changes:boolean = this.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.setMarkersChanges(params);
    }
  };

  initializeMap():void {
    window['CESIUM_BASE_URL'] = 'assets/Cesium';
    Cesium.BingMapsApi.defaultKey = 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq';
    this.viewer = new Cesium.Viewer('cesiumContainer');
    window['viewer'] = this.viewer;
    this.viewer.camera.moveEnd.addEventListener(this.moveEnd);
  }

  anyViewChanges(params:Params):boolean {

    let longitudeP:number       = this.queryParamsHelperService.queryLng(params)// || this.getCenter().lng;
    let latitudeP:number        = this.queryParamsHelperService.queryLat(params)// || this.getCenter().lat;
    let heightP:number          = this.queryParamsHelperService.queryHeight(params)// || this.viewer.camera.positionCartographic.height;
    let headingRadiansP:number  = this.queryParamsHelperService.queryHeading(params) % 360;
    let pitchRadiansP:number    = this.queryParamsHelperService.queryPitch(params) % 360;
    let rollRadiansP:number     = this.queryParamsHelperService.queryRoll(params) % 360;
    let mode3dP:number             = this.queryParamsHelperService.queryMode3d(params);
    let rotateP:number          = this.queryParamsHelperService.queryRotate(params);

    let arrayP:Array<number> = [longitudeP, latitudeP, heightP, headingRadiansP, pitchRadiansP, rollRadiansP, mode3dP, rotateP];

    let longitude:number        = this.getCenter().lng;
    let latitude:number         = this.getCenter().lat;
    let height:number           = this.viewer.camera.positionCartographic.height;
    let headingRadians:number   = +Cesium.Math.toDegrees(this.viewer.camera.heading) % 360;
    let pitchRadians:number     = +Cesium.Math.toDegrees(this.viewer.camera.pitch) % 360;
    let rollRadians:number      = +Cesium.Math.toDegrees(this.viewer.camera.roll) % 360;
    let mode3d:number           = this.viewer.scene.mode == Cesium.SceneMode.SCENE3D ? 1 : 0;
    let rotate:number           = this.viewer.scene.mapMode2D == Cesium.MapMode2D.INFINITE_SCROLL ? 0 : 1;

    let array = [longitude, latitude, height, headingRadians, pitchRadians, rollRadians, mode3d, rotate];

    arrayP.forEach( (value, index) => {arrayP[index] = +arrayP[index].toFixed(7)});
    array.forEach( (value, index) => {array[index] = +array[index].toFixed(7)});

    return !_.isEqual(arrayP, array) || rotate == rotateP
  }

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersCartographicDegreesPositions:Array<[number, number, number]> = this.queryParamsHelperService.queryMarkers(params);
    let mapMarkerCartesienPositions = this.getMarkersPosition();

    let queryMarkersCartesienPositions = queryMarkersCartographicDegreesPositions.map((marker) => Cesium.Cartesian3.fromDegrees(...marker));
    mapMarkerCartesienPositions.forEach((markerCartesienPosition) => {
      _.forEach(markerCartesienPosition, (val, key) => {
        markerCartesienPosition[key] = +val.toFixed(7)
      });
    });

    queryMarkersCartesienPositions.forEach((markerCartesienPosition) => {
      _.forEach(markerCartesienPosition, (val, key) => {
        markerCartesienPosition[key] = +val.toFixed(7)
      });
    });

    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartesienPositions ) ;
  }



  getMarkersPosition() {
    let points = this.viewer.entities.values.filter( (one) => one.billboard );
    let cartesianPositions = points.map( (entity) => {
      return entity.position.getValue();
    });
    return cartesianPositions;
  }

  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params) || this.getCenter().lng;
    let latitude:number = this.queryParamsHelperService.queryLat(params) || this.getCenter().lat;
    let height = this.queryParamsHelperService.queryHeight(params) || this.viewer.camera.positionCartographic.height;
    let headingRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(params));
    let pitchRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryPitch(params));
    let rollRadians = Cesium.Math.toRadians(this.queryParamsHelperService.queryRoll(params));
    let mode3d:number =  this.queryParamsHelperService.queryMode3d(params);
    let rotate:number =  this.queryParamsHelperService.queryRotate(params) == 0 ? 1 : 0;

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

  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<[number, number, number]> = this.queryParamsHelperService.queryMarkers(params);
    let map_markers_positions:Array<[number, number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position);
    this.removeMarkersViaUrl(map_markers_positions);
  }


  addMarkersViaUrl(params_markers_position) {
    params_markers_position.forEach( (marker) => {
      if(!this.markerExistOnMap(marker)) {
        this.viewer.entities.add({
          position : Cesium.Cartesian3.fromDegrees(...marker),
          billboard: {
            image: "/assets/Leaflet/images/marker-icon.png"
          }
        });
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions) {
    map_markers_positions.forEach((cartesianPosition) => {
      if(!this.markerExistOnParams(cartesianPosition)) {
        let entity_to_remove = this.viewer.entities.values.find((entity) => {
          let position = this.calcService.toFixes7Obj(entity.position.getValue());
          cartesianPosition = this.calcService.toFixes7Obj(cartesianPosition);
          return _.isEqual(position, cartesianPosition);
        });
        this.viewer.entities.remove(entity_to_remove)
      }
    })
  }

  markerExistOnMap(markerPosition:[number,number, number]):boolean {
    let current_marker_radian_position = Cesium.Cartesian3.fromDegrees(...markerPosition);
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions .find((positionArray) => _.isEqual(positionArray, current_marker_radian_position));
    return !isUndefined(exist_point);
  }

  // toFixes7Obj(obj) {
  //   _.forEach(obj, (val, key) => {
  //     obj[key] = +val.toFixed(7)
  //   });
  //   return obj;
  // }

  markerExistOnParams(markerPosition:{x:number,y:number,z:number}) {

    let markers_params_positions = this.queryParamsHelperService.queryMarkers(this.currentParams);

    let exist_point = markers_params_positions.find((positionArray) => {
      let positionCartesian = Cesium.Cartesian3.fromDegrees(...positionArray);
      positionCartesian = this.calcService.toFixes7Obj(positionCartesian);
      markerPosition = this.calcService.toFixes7Obj(markerPosition );
      return _.isEqual(positionCartesian, markerPosition)
    });
    return !isUndefined(exist_point);
  }


  moveEnd: () => Promise<boolean> = ():Promise<boolean> => {

    if(!this.anyViewChanges(this.currentParams)) return;
    //
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
    let rotate = this.viewer.scene._mapMode2D == 0 ? 1 : 0;

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, mode3d, markers, rotate});

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
    this.viewer.scene._mapMode2D == Cesium.MapMode2D.ROTATE

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
        that.viewer.scene.camera.flyTo(flyToObj);
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

  getBounds() : [number,number,number,number]{

    let current_mode:number = this.viewer.scene.mode;
    let current_heading:number = this.viewer.camera.heading;
    let current_mapMode2D:number = this.viewer.scene.mapMode2D;

    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    this.viewer.scene._mapMode2D = Cesium.MapMode2D.ROTATE;

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

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
    let heading:number = Cesium.Math.toRadians(this.queryParamsHelperService.queryHeading(this.currentParams));

    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(...bounds),
      orientation: {
        heading: heading
      }
    });

  }


}
