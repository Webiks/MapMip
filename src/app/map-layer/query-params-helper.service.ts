import {Injectable, Component, style, state, animate, transition, trigger} from '@angular/core';
import {Params, ActivatedRoute, Router, NavigationExtras} from "@angular/router";
import {isEqual} from 'lodash';

@Injectable()
export class QueryParamsHelperService {

  public bounds:[number, number,number,number] = [0,0,0,0];

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
  queryDim(params:Params) {
    return +params['dim'] || 3;
  }

  getQuery(queryObj):NavigationExtras {
    queryObj.roll =  queryObj.roll % 360  == 0 ? undefined : queryObj.roll;
    queryObj.heading = queryObj.heading % 360  == 0 ? undefined : queryObj.heading;
    queryObj.pitch = queryObj.pitch == -90 ? undefined : queryObj.pitch;//Math.cos(Cesium.Math.toRadians(queryObj.pitch) ) < 0.001 ? undefined : queryObj.pitch;
    return <NavigationExtras> {
      queryParams: queryObj
    };
  }
  queryHeight(params:Params):number {
    return +params["height"] || 0;
  }
  hasBounds():boolean {
    return !isEqual(this.bounds, [0,0,0,0]);
  }

  setBounds(bounds:[number,number, number, number]):void {
    console.log("bounds = ",bounds);
    this.bounds = bounds;
  }

  getBounds():[number,number, number, number] {
    return this.bounds;
  }

  resetBounds():void {
    this.bounds = [0,0,0,0];
  }
}
