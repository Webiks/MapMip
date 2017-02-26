import { Injectable } from '@angular/core';
import {QueryParamsHelperService} from "./query-params-helper.service";
import {Router, UrlTree} from "@angular/router";

@Injectable()
export class MapLayerApiService {

  constructor(private queryParamsHelperService:QueryParamsHelperService, private router:Router) {

  }
  addMarker(marker){
    this.queryParamsHelperService.addMarker(marker);
  }

  changePosition(lng:string,lat:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["lng"] = lng;
    urlTree.queryParams["lat"] = lat;
    this.router.navigateByUrl(urlTree.toString());
  }

  //cesium specific
  cesiumChangeHeight(height:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("height"))
      return;
    urlTree.queryParams["height"] = height;
    this.router.navigateByUrl(urlTree.toString());
  }
  //cesium & OL3 specific
  ChangeHeading(heading:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("heading"))
      return;
    urlTree.queryParams["heading"] = heading;
    this.router.navigateByUrl(urlTree.toString());
  }
  cesiumChangePitch(pitch:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("pitch"))
      return;
    urlTree.queryParams["pitch"] = pitch;
    this.router.navigateByUrl(urlTree.toString());
  }
  cesiumChangeRoll(roll:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("roll"))
      return;
    urlTree.queryParams["roll"] = roll;
    this.router.navigateByUrl(urlTree.toString());
  }
  cesiumChangeMode3d(mode3d:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("mode3d"))
      return;
    urlTree.queryParams["mode3d"] = mode3d;
    this.router.navigateByUrl(urlTree.toString());
  }
  Ol3Rotate(rotate:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    if(!urlTree.queryParams.hasOwnProperty("rotate"))
      return;
    urlTree.queryParams["rotate"] = rotate;
    this.router.navigateByUrl(urlTree.toString());
  }
  changeSize(width:string,height:string){
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams["size"] = width+","+height;
    this.router.navigateByUrl(urlTree.toString());
  }



}
