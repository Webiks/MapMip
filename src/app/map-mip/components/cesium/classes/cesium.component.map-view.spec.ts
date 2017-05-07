import {CesiumComponent} from "../cesium.component";
import {TestBed, inject, async, ComponentFixture} from "@angular/core/testing";
import {PositionFormService} from "../../position-form/position-form.service";
import {CalcService} from "../../../services/calc-service";
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {Router, NavigationEnd, Params, NavigationExtras} from "@angular/router";
//import {GeneralCanDeactivateService} from "../../../services/general-can-deactivate.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CesiumMapView} from "./cesium.component.map-view";
import {Observer, Observable} from "rxjs";

describe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let router: Router;
  let queryParamsHelperService: QueryParamsHelperService;
  let calcService: CalcService;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CesiumComponent],
      providers: [QueryParamsHelperService, /*GeneralCanDeactivateService,*/ CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router, QueryParamsHelperService, CalcService, PositionFormService], (_router: Router, _queryParamsHelperService: QueryParamsHelperService, _calcService: CalcService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
    positionFormService = _positionFormService;
  }));

  describe("map-view", () => {
    let map_view:CesiumMapView;

    beforeEach(() => {
      map_view = component.map_view;
    });
    describe("queryParams", ()=>{
      it('params with "bounds" should make setMapBounds to have been call', () => {
        spyOn(map_view, 'setMapBounds');
        let params:Params = {
          lat:'1.123',
          lng:'4.567',
          bounds: '1,2,3,4'
        };
        map_view.queryParams(params);
        expect(map_view.setMapBounds).toHaveBeenCalledWith(params);
      });

      it('params with no "bounds" should make setMapView to have been call, only when anyParamChanges return "true"', () => {
        let anyParamsChangesReturnValue:boolean = false;
        spyOn(map_view, 'setMapView');
        spyOn(map_view, 'anyParamChanges').and.callFake(() => anyParamsChangesReturnValue);
        let params:Params = {
          lat:'1.123',
          lng:'4.567'
        };
        map_view.queryParams(params);
        expect(map_view.setMapView).not.toHaveBeenCalledWith(params);
        anyParamsChangesReturnValue = true;
        map_view.queryParams(params);
        expect(map_view.setMapView).toHaveBeenCalledWith(params);
      });
    });

    it("destroy", ()=> {
      spyOn(component.viewer.camera.moveEnd._listeners, 'pop');
      spyOn(map_view.queryParamsSubscriber, 'unsubscribe');
      map_view.destroy();
      expect(component.viewer.camera.moveEnd._listeners.pop).toHaveBeenCalled();
      expect(map_view.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('setMapView should get params and use them to set rotate, set mode and call map.setView with params values',()=>{
      spyOn(component.viewer.camera, 'setView');

      let params:Params = {
        lng: 1,
        lat: 2,
        heading:3,
        pitch:4,
        roll: 5,
        height:6,
        rotate: undefined,
        mode3d: 1
      };

      map_view.setMapView(params);

      let view_to_call_with =  {
        destination: Cesium.Cartesian3.fromDegrees(...[params['lng'],params['lat'],params['height']]),
        orientation: {heading:Cesium.Math.toRadians(params['heading']), pitch: Cesium.Math.toRadians(params['pitch']), roll: Cesium.Math.toRadians(params['roll']) }
      };

      expect(component.viewer.camera.setView).toHaveBeenCalledWith(view_to_call_with);
      expect(component.viewer.scene.mode).toEqual(Cesium.SceneMode.SCENE3D);
      expect(component.viewer.scene.mapMode2D).toEqual(Cesium.MapMode2D.INFINITE_SCROLL);
    });

    it('setQueryBoundsOnNavigationEnd: get url, parse url to UrlTree Object, add "bounds" to queryParams, parse back and navigate with new url', () => {
      spyOn(map_view, 'getBounds').and.returnValue([1,2,3,4]);
      spyOn(router, 'navigateByUrl');

      let state:string ="/cesium";
      map_view.setQueryBoundsOnNavigationEnd(state);

      expect(router.navigateByUrl).toHaveBeenCalledWith(`/cesium`)
    });



    it("anyParamChanges should get params and check if there's any changes between params and map" , () => {

      let params:Params = {
        lng: map_view.getCenter().lng,
        lat: map_view.getCenter().lat,
        height: component.viewer.camera.positionCartographic.height,
        heading: Cesium.Math.toDegrees(component.viewer.camera.heading) % 360,
        pitch: Cesium.Math.toDegrees(component.viewer.camera.pitch) % 360,
        roll: Cesium.Math.toDegrees(component.viewer.camera.roll) % 360,
        mode3d: component.viewer.scene.mode == Cesium.SceneMode.SCENE3D ? 1 : 0,
        rotate: component.viewer.scene.mapMode2D == Cesium.MapMode2D.INFINITE_SCROLL ? undefined : 1
      };

      expect(map_view.anyParamChanges(params)).toBeFalsy();
      params['lng'] = map_view.getCenter().lng + 2;
      expect(map_view.anyParamChanges(params)).toBeTruthy();
    });


    it('moveEnd: should get lat,lng and zoom parameters from "event" and markers from currentParams', () => {

      let resultAnyParamsChange:boolean = false;
      spyOn(router, 'navigate');
      spyOn(map_view, 'anyParamChanges').and.callFake(() => resultAnyParamsChange);
      map_view.moveEnd();
      expect(router.navigate).not.toHaveBeenCalled();

      component.currentParams['layers'] = "(url:'fake_url')";
      component.currentParams['markers'] = "(1,2,3)";

      resultAnyParamsChange = true;
      map_view.moveEnd();
      let center: {lat:number, lng:number} = map_view.getCenter();
      if(!center) return;
      let lat:number = center.lat;
      let lng:number = center.lng;
      let height:number = component.viewer.camera.positionCartographic.height;//.toFixed(7);
      let heading:number = +Cesium.Math.toDegrees(component.viewer.camera.heading);//.toFixed(7);

      let pitch:number = +Cesium.Math.toDegrees(component.viewer.camera.pitch);//.toFixed(7);
      let roll:number = +Cesium.Math.toDegrees(component.viewer.camera.roll);//.toFixed(7);
      let mode3d:number = component.viewer.scene.mode == Cesium.SceneMode.SCENE2D ? 0 : 1;
      let markers = component.currentParams['markers'];
      let layers = component.currentParams['layers'];
      let rotate = component.viewer.scene._mapMode2D == Cesium.MapMode2D.ROTATE ? 1 : undefined;

      let navigationExtras:NavigationExtras = queryParamsHelperService.getQuery({lng, lat, height, heading, pitch, roll, mode3d, markers, layers, rotate});
      expect(router.navigate).toHaveBeenCalledWith([], navigationExtras);
    });

    it('getCenter should return object with lng and lat (degrees) of the center', () => {
      let latitude = Cesium.Math.toDegrees(component.viewer.camera.positionCartographic.latitude);
      let longitude = Cesium.Math.toDegrees(component.viewer.camera.positionCartographic.longitude);
      let result = calcService.toFixes7Obj({lng:longitude,lat:latitude});
      expect(map_view.getCenter()).toEqual(result)
    });

    it('setMapBounds should get params and use them to call setView' , () => {
      spyOn(component.viewer.camera, 'setView');

      let params:Params = {
        bounds :'1,2,3,4',
        heading: 90
      };
      let viewObj = {
        destination: Cesium.Rectangle.fromDegrees(...[1,2,3,4]),
        orientation: {heading: Cesium.Math.toRadians(90)}
      };

      map_view.setMapBounds(params);
      expect(component.viewer.camera.setView).toHaveBeenCalledWith(viewObj);
    });

    it("getBounds should get bounds from calcBounds function and return the bounds as [number,number,number,number]" , () => {
      spyOn(map_view,'calcBounds').and.returnValue([1,2,3,4]);
      let expectResult = [1,2,3,4].map( (value:number) => Cesium.Math.toDegrees(value));
      let getBoundsResult = map_view.getBounds();
      expect(map_view.calcBounds()).toEqual([1,2,3,4]);
      expect(getBoundsResult).toEqual(expectResult)
    });


    it('flyToCenterAndGetBounds shuold call flyTo with right values, only when sceneMode on SCENE3D and heading, roll, pitch not equal to zero', () => {
      spyOn(component.viewer.camera, 'flyTo');
      component.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
      let go_north:boolean =true;
      map_view.flyToCenterAndGetBounds(go_north).toPromise().then(()=>{
        expect(component.viewer.camera.flyTo).not.toHaveBeenCalled();
        component.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
        map_view.flyToCenterAndGetBounds(!go_north).toPromise().then(()=>{
          expect(component.viewer.camera.flyTo).toHaveBeenCalled();
        });
      });
    });


   /* it('onLeave: should call ngOnDestroy , call flyToCenterAndGetBounds and call obs.next with response ', () => {
      let observer:Observer<boolean> = <any>{ next(bool:boolean):void {}};
      Observable.create((_observer:Observer<boolean>) => {observer = _observer});
      let bool_result:boolean = true;
      let fake_obs = { subscribe: callback => callback(bool_result) };
      spyOn(component, "ngOnDestroy");
      spyOn(map_view, 'flyToCenterAndGetBounds').and.returnValue(fake_obs);
      spyOn(observer, 'next');
      map_view.onLeave(observer);
      expect(component.ngOnDestroy).toHaveBeenCalled();
      expect(map_view.flyToCenterAndGetBounds).toHaveBeenCalled();
      expect(observer.next).toHaveBeenCalledWith(bool_result);
    });
*/




  })
});
