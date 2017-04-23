import {Injectable, EventEmitter} from '@angular/core';
import {PositionFormService} from "../components/position-form/position-form.service";
import {NavigationCancel, NavigationExtras, Router, UrlTree} from "@angular/router";
import {Location} from '@angular/common';
import {QueryParamsHelperService} from "../services/query-params-helper.service";
import * as _ from 'lodash';

@Injectable()
export class MapMipService {
  static LEAFLET_PATH: string = '/leaflet';
  static OPENLAYERS_PATH: string = '/openlayers';
  static CESIUM_PATH: string = '/cesium';

  private _skipLocationChange:boolean = false;
  private default_state:string = '/leaflet';
  public gotoEmitter  = new EventEmitter();
  constructor(private positionFormService: PositionFormService, public router: Router, private location: Location,private queryParamsHelperService:QueryParamsHelperService){

    this.router.events.filter(e => e.url === '/').subscribe((e) => {
      this.navigate([this.default_state]);
    });

    this.router.events.filter(e => e instanceof NavigationCancel).subscribe((e) => {
    });


  }

  get skipLocationChange(): boolean {
    return this._skipLocationChange;
  }

  set skipLocationChange(value: boolean) {
    if (value) {
      this.location.go('');
    }
    this._skipLocationChange = value;
  }

  togglePositionForm(status?){
    if(status) this.positionFormService.hideComponent = status;
    else this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
  }

  positionFormHidden():boolean {
    return this.positionFormService.hideComponent;
  }
  goTo(state: '/leaflet' | '/cesium' | '/openlayers'): void {
    if(!this.isActive(state)) {
      this.gotoEmitter.emit(state);
    }
  }

  navigate(commands: any[], extras: NavigationExtras = {}): Promise<any> {
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigate(commands, extras);
  }

  navigateByUrl(url: string | UrlTree, extras: NavigationExtras = {}): Promise<boolean>{
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigateByUrl(url, extras);
  }

  isActive(state):boolean {
    return this.router.isActive(`/${state}`, false);
  }

  changePosition(lng:string,lat:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["lng"] = lng;
    urlTree.queryParams["lat"] = lat;
    this.navigateByUrl(urlTree.toString());
  }
  addMarker(marker){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let markers_array:Array<any> = this.queryParamsHelperService.markersStrToArray(urlTree.queryParams['markers']);
    markers_array.push(marker);
    urlTree.queryParams['markers'] = this.queryParamsHelperService.markersArrayToStr(markers_array);
    this.navigateByUrl(urlTree.toString())
  }
/*  addMarker(marker){
    this.queryParamsHelperService.addMarker(marker);
  }*/
  //cesium specific
  cesiumChangeHeight(height:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("height"))
      return;
    urlTree.queryParams["height"] = height;
    this.navigateByUrl(urlTree.toString());
  }
  //cesium & OL3 specific
  ChangeHeading(heading:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("heading"))
      return;
    urlTree.queryParams["heading"] = heading;
    this.navigateByUrl(urlTree.toString());
  }
  cesiumChangePitch(pitch:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("pitch"))
      return;
    urlTree.queryParams["pitch"] = pitch;
    this.navigateByUrl(urlTree.toString());
  }
  cesiumChangeRoll(roll:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("roll"))
      return;
    urlTree.queryParams["roll"] = roll;
    this.navigateByUrl(urlTree.toString());
  }
  cesiumChangeMode3d(mode3d:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("mode3d")&& mode3d !="0"  || mode3d ==""  )
      return;
    urlTree.queryParams["mode3d"] = mode3d;
    this.navigateByUrl(urlTree.toString());
  }
  cesiumRotate(rotate:string){
    let urlTree = this.router.parseUrl(this.router.url);
    if(urlTree.queryParams["mode3d"]!="0")
      return;
    if (rotate!="1")
    {delete urlTree.queryParams["rotate"];
      this.navigateByUrl(urlTree.toString());
      return;
    }
    urlTree.queryParams["rotate"]= rotate;
    this.navigateByUrl(urlTree.toString());
  }

  cesiumChangeTerrain(terrain:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["terrain"]= terrain;
    this.navigateByUrl(urlTree.toString());
  }

  cesiumChangeLighting(lighting:string){
    let urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["lighting"]= lighting;
    this.navigateByUrl(urlTree.toString());
  }

  Ol3Rotate(rotate:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("rotate") && rotate !="0" || rotate == "")
      return;
    urlTree.queryParams["rotate"] = rotate;
    this.navigateByUrl(urlTree.toString());
  }
  changeSize(width:string,height:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["size"] = width+","+height;
    this.navigateByUrl(urlTree.toString());
  }
  changeMapPositionInPage(width:string,height:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["position"] = width+","+height;
    this.navigateByUrl(urlTree.toString());
  }
  leafletChangeZoom (zoom:number){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["zoom"]= zoom.toString();
    this.navigateByUrl(urlTree.toString());
  }
  Ol3changeZoom (zoom:number){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["zoom"]= (zoom <20 ? zoom: 19).toString();
    this.navigateByUrl(urlTree.toString());
  }

  /*removeMarkerByPosition(marker){
    this.queryParamsHelperService.removeMarker(marker);
  }*/
  removeMarker(marker){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let markers_array:Array<any> = this.queryParamsHelperService.markersStrToArray(urlTree.queryParams['markers']);
    _.forEach(markers_array,function(m,index){
      if (marker.position[0]==m.position[0] && marker.position[1]==m.position[1] && marker.color==m.color) {
        markers_array.splice(index,1)
      }
    });
    urlTree.queryParams['markers'] = this.queryParamsHelperService.markersArrayToStr(markers_array);
    this.navigateByUrl(urlTree.toString());
  }

/*
  addGeojson(geojson){
    this.queryParamsHelperService.addGeojson(geojson);
  }*/
  addGeojson(geojson){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let geojson_array:Array<any> = this.queryParamsHelperService.geojsonStrToArray(urlTree.queryParams['geojson']);
    geojson_array.push(geojson);
    urlTree.queryParams['geojson'] = this.queryParamsHelperService.geojsonArrayToStr(geojson_array);
    this.navigateByUrl(urlTree.toString())
  }
}
