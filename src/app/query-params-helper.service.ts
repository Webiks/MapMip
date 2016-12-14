import {Injectable, Component} from '@angular/core';
import {Params, ActivatedRoute, Router, NavigationExtras} from "@angular/router";

@Injectable()
export class QueryParamsHelperService {

  constructor(private router:Router) { }

  queryZoom(params:Params):number {
    return +params['zoom'] || 0;
  }

  queryCenter(params:Params):{lng:number, lat:number} {
    return {lng: this.queryLng(params), lat: this.queryLat(params)};
  }

  queryLat(params:Params):number {
    return +params['lat'] || 0;
  }

  queryLng(params:Params):number {
    return +params['lng'] || 0;
  }

  queryHeading(params:Params):number {
    let heading:number = params['heading'] ? params['heading'] : 0;
    return heading;
  }

  queryPitch(params:Params):number {
    let pitch:number = params['pitch'] ? params['pitch'] : -90;
    return pitch;
  }
  queryRoll(params:Params) {
    let roll:number = params['roll'] ? params['roll'] : 0;
    return roll;
  }

  setQuery(lng:number, lat:number, zoom:number, activatedRoute:ActivatedRoute, heading?:number, pitch?:number, roll?:number){

    roll =  roll % 360  == 0 ? undefined : roll;
    heading = heading % 360  == 0 ? undefined : heading;
    pitch = Math.cos(Cesium.Math.toRadians(pitch) ) < 0.001 ? undefined : pitch;

    // if(heading) console.log("header = " + Cesium.Math.toRadians(heading));

    let navigationExtras:NavigationExtras = {
      queryParams: {lng, lat, zoom, heading, pitch, roll},
      relativeTo: activatedRoute
    };

    this.router.navigate(['./'], navigationExtras);
  }

}
