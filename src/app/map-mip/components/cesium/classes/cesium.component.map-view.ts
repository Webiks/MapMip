import { CesiumComponent } from '../cesium.component';
import { NavigationExtras, Params } from '@angular/router';
import * as _ from 'lodash';
import { Observable, Observer } from 'rxjs';
import { MapMipService } from '../../../api/map-mip.service';

export class CesiumMapView {
  queryParamsSubscriber;
  gotoEmitterSubscriber;

  constructor(private cesium: CesiumComponent) {
    cesium.viewer.camera.moveEnd.addEventListener(this.moveEnd.bind(this));
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    this.gotoEmitterSubscriber = cesium.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else if (this.anyParamChanges(params)) {
      this.setMapView(params);
    }
  }

  anyParamChanges(params: Params): boolean {

    let longitudeP: number = this.cesium.queryParamsHelperService.queryLng(params); // || this.getCenter().lng;
    let latitudeP: number = this.cesium.queryParamsHelperService.queryLat(params); // || this.getCenter().lat;
    let heightP: number = this.cesium.queryParamsHelperService.queryHeight(params); // || this.viewer.camera.positionCartographic.height;
    let headingRadiansP: number = this.cesium.queryParamsHelperService.queryHeading(params) % 360;
    let pitchRadiansP: number = this.cesium.queryParamsHelperService.queryPitch(params) % 360;
    let rollRadiansP: number = this.cesium.queryParamsHelperService.queryRoll(params) % 360;
    let mode3dP: number = this.cesium.queryParamsHelperService.queryMode3d(params);
    let rotateP: number = this.cesium.queryParamsHelperService.queryRotate(params);
    let lightingP: number = this.cesium.queryParamsHelperService.queryLighting(params);


    let arrayP: Array<number> = [longitudeP, latitudeP, heightP, headingRadiansP, pitchRadiansP, rollRadiansP, mode3dP, rotateP, lightingP];

    let longitude: number = this.getCenter().lng;
    let latitude: number = this.getCenter().lat;
    let height: number = this.cesium.viewer.camera.positionCartographic.height;
    let headingRadians: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.heading) % 360;
    let pitchRadians: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch) % 360;
    let rollRadians: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.roll) % 360;
    let mode3d: number = this.cesium.viewer.scene.mode === Cesium.SceneMode.SCENE3D ? 1 : 0;
    let rotate: number;
    let lighting: number = this.cesium.viewer.scene.globe.enableLighting ? 1 : 0;


    if (this.cesium.viewer.scene.mode === Cesium.SceneMode.SCENE3D || this.cesium.viewer.scene._mapMode2D === 1) {
      rotate = NaN;
    } else {
      rotate = 1;
    }
    let array = [longitude, latitude, height, headingRadians, pitchRadians, rollRadians, mode3d, rotate, lighting];

    arrayP = this.cesium.calcService.toFixes7Obj(arrayP);
    array = this.cesium.calcService.toFixes7Obj(array);

    return !_.isEqual(arrayP, array);
  }

  setMapView(params: Params): void {

    let longitude: number = this.cesium.queryParamsHelperService.queryLng(params) || this.getCenter().lng;
    let latitude: number = this.cesium.queryParamsHelperService.queryLat(params) || this.getCenter().lat;
    let height = this.cesium.queryParamsHelperService.queryHeight(params) || this.cesium.viewer.camera.positionCartographic.height;
    let headingRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryHeading(params));
    let pitchRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryPitch(params));
    let rollRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryRoll(params));
    let mode3d: number = this.cesium.queryParamsHelperService.queryMode3d(params);
    let rotate: number = isNaN(this.cesium.queryParamsHelperService.queryRotate(params)) ? 1 : 0;

    this.cesium.viewer.scene.mode = mode3d === 0 ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D;
    this.cesium.viewer.scene._mapMode2D = rotate;

    this.cesium.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
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

  moveEnd() {
    if (!this.anyParamChanges(this.cesium.currentParams)) {
      return;
    }

    let center: { lat: number, lng: number } = this.getCenter();
    if (!center) {
      return;
    }
    let lat: number = center.lat;
    let lng: number = center.lng;
    let height: number = this.cesium.viewer.camera.positionCartographic.height; // .toFixed(7);
    let heading: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.heading); // .toFixed(7);

    let pitch: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch); // .toFixed(7);
    let roll: number = +Cesium.Math.toDegrees(this.cesium.viewer.camera.roll); // .toFixed(7);
    let mode3d: number = this.cesium.viewer.scene.mode === Cesium.SceneMode.SCENE2D ? 0 : 1;
    let markers = this.cesium.currentParams['markers'];
    let layers = this.cesium.currentParams['layers'];
    let rotate = this.cesium.currentParams['rotate'];
    let size = this.cesium.currentParams['size'];
    let position = this.cesium.currentParams['position'];
    let terrain = this.cesium.currentParams['terrain'];
    let lighting = this.cesium.currentParams['lighting'];
    let geojson = this.cesium.currentParams['geojson'];
    let polygons = this.cesium.currentParams['polygons'];
    let polyline = this.cesium.currentParams['polyline'];

    rotate = this.cesium.viewer.scene.mode !== Cesium.SceneMode.SCENE2D || rotate !== 1 ? undefined : 1;
    let navigationExtras: NavigationExtras = this.cesium.queryParamsHelperService.getQuery({
      lng,
      lat,
      height,
      heading,
      pitch,
      roll,
      mode3d,
      markers,
      rotate,
      layers,
      size,
      position,
      terrain,
      lighting,
      geojson,
      polygons,
      polyline
    });
    return this.cesium.mapMipService.navigate([], navigationExtras);
  };

  getCenter(): { lat: number, lng: number } | any {
    let lat = Cesium.Math.toDegrees(this.cesium.viewer.camera.positionCartographic.latitude);
    let lng = Cesium.Math.toDegrees(this.cesium.viewer.camera.positionCartographic.longitude);
    return this.cesium.calcService.toFixes7Obj({ lat: lat, lng: lng });
  }

  getBounds(): [number, number, number, number] {

    let current_mode: number = this.cesium.viewer.scene.mode;
    let current_heading: number = this.cesium.viewer.camera.heading;
    let current_mapMode2D: number = this.cesium.viewer.scene.mapMode2D;

    this.cesium.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    this.cesium.viewer.scene._mapMode2D = 0;

    this.cesium.viewer.camera.setView({
      orientation: {
        heading: 0
      }
    });

    let bounds: [number, number, number, number] = this.calcBounds();
    bounds = <[number, number, number, number]> bounds.map((value: number) => Cesium.Math.toDegrees(value));
    // let bounds: [number,number,number,number] = this.viewer.camera.computeViewRectangle();
    // if(isUndefined(bounds)) bounds = this.calcBounds();

    this.cesium.viewer.scene.mode = current_mode;
    this.cesium.viewer.scene._mapMode2D = current_mapMode2D;

    this.cesium.viewer.camera.setView({
      orientation: {
        heading: current_heading
      }
    });

    return bounds;

  }

  calcBounds(): [number, number, number, number] {
    let bounds: [number, number, number, number];

    let leftTopCartesian2 = new Cesium.Cartesian2(0, 0);
    let leftTopCartesian3 = this.cesium.viewer.camera.pickEllipsoid(leftTopCartesian2);
    let rightBottomCartesian2 = new Cesium.Cartesian2(this.cesium.viewer.canvas.width, this.cesium.viewer.canvas.height);
    let rightBottomCartesian3 = this.cesium.viewer.camera.pickEllipsoid(rightBottomCartesian2);

    if (_.isEmpty(leftTopCartesian3) || _.isEmpty(rightBottomCartesian3)) {
      let o_bounds = this.cesium.viewer.camera.computeViewRectangle();
      return [o_bounds.west, o_bounds.north, o_bounds.east, o_bounds.south];
    }
    let cartographicLeftTop = Cesium.Cartographic.fromCartesian(leftTopCartesian3);
    let cartographicRightBottom = Cesium.Cartographic.fromCartesian(rightBottomCartesian3);
    bounds = [cartographicRightBottom.longitude, cartographicLeftTop.latitude, cartographicLeftTop.longitude, cartographicRightBottom.latitude];

    return bounds;
  }


  setMapBounds(params: Params): void {
    let bounds: [number, number, number, number] = this.cesium.queryParamsHelperService.queryBounds(params);
    let heading: number = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryHeading(params));

    this.cesium.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(...bounds),
      orientation: {
        heading: heading
      }
    });

  }

  onLeave(go_north: boolean): Observable<any> {
    return Observable.create((observer: Observer<boolean>) => {
      this.flyToCenterAndGetBounds(go_north).subscribe((bool: boolean) => {
        observer.next(bool);
      });
    });
  };

  flyToCenterAndGetBounds(go_north: boolean) {
    this.cesium.viewer.scene._mapMode2D = 0;

    const headingDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.heading);
    const pitchDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch);
    const rollDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.roll);

    let on_d3 = headingDeg % 360 === 0 && pitchDeg === -90 && rollDeg % 360 === 0;
    let on_d2 = this.cesium.viewer.scene.mode === Cesium.SceneMode.SCENE2D;
    if (on_d3 || on_d2) {
      return Observable.of(true);
    } else {
      let position, that = this;
      return new Observable<any>(obs => {
        let heading = this.cesium.viewer.camera.heading;

        if (Math.cos(that.cesium.viewer.camera.pitch) < 0.001) {
          position = that.cesium.viewer.camera.position;
        } else {
          try {
            let rect = that.cesium.viewer.canvas.getBoundingClientRect();

            let center = new Cesium.Cartesian2(rect.width / 2, rect.height / 2);
            position = that.cesium.viewer.camera.pickEllipsoid(center, that.cesium.viewer.scene.globe.ellipsoid);

            let cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = that.cesium.viewer.camera.positionCartographic.height;

            position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
          } catch (err) {
            position = that.cesium.viewer.camera.position;
          }
        }

        let flyToObj = {
          destination: position,
          easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          orientation: {
            heading: go_north ? 0 : heading,
            pitch: Cesium.Math.toRadians(-90.0), // look down
            roll: 0.0 // no change
          },
          duration: 0.5,
          complete: () => {
            obs.next(true);
          }
        };
        that.cesium.viewer.camera.flyTo(flyToObj);
      });
    }
  }


  // setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event):void => {
  //   let urlTree:UrlTree = this.cesium.router.parseUrl(event);
  //   urlTree.queryParams['bounds'] = this.getBounds().toString();
  //   this.cesium.mapMipService.navigateByUrl(urlTree.toString());
  // };

  setQueryBoundsOnNavigationEnd(state: string): void {
    let extras: NavigationExtras = {};
    let go_north = state === MapMipService.LEAFLET_PATH ? true : false;

    this.onLeave(go_north).subscribe(() => {
      let bounds = this.getBounds().toString();
      let markers = this.cesium.currentParams['markers'];
      let layers = this.cesium.currentParams['layers'];
      let size = this.cesium.currentParams['size'];
      let position = this.cesium.currentParams['position'];
      let geojson = this.cesium.currentParams['geojson'];
      let polygons = this.cesium.currentParams['polygons'];
      let polyline = this.cesium.currentParams['polyline'];

      extras.queryParams = { bounds, markers, layers, size, position, geojson, polygons, polyline };

      if (state === MapMipService.OPENLAYERS_PATH) {
        let heading = this.cesium.queryParamsHelperService.queryHeading(this.cesium.currentParams);
        extras.queryParams['heading'] = heading;
      }

      this.cesium.mapMipService.navigate([state], extras).then(() => {
        this.cesium.viewer.camera.moveEnd._listeners.pop();
        this.gotoEmitterSubscriber.unsubscribe();
      });
    });
  }
}
