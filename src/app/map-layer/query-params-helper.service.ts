import {Injectable, Component, style, state, animate, transition, trigger} from '@angular/core';
import {Params, ActivatedRoute, Router, NavigationExtras} from "@angular/router";
import {isEqual} from 'lodash';
import {isUndefined} from "util";

@Injectable()
export class QueryParamsHelperService {

  public bounds:[number, number,number,number] = [0,0,0,0];

  constructor(private router:Router) { }

  queryBounds(params:Params):[number, number, number, number] {
    let boundsString = params['bounds'];
    let bounds:[number, number, number, number] = boundsString.split(',').map(strToNum => +strToNum);
    return bounds;
  }

  hasQueryBounds(params:Params):boolean {
    let boundsString = params['bounds'];
    return !isUndefined(boundsString)
  }

  queryZoom(params:Params):number {
    return +params['zoom'] || 0;
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

  queryHeight(params:Params):number {
    return +params["height"] || 0;
  }

  haveLeafletOpenlayersParams(params:Params):boolean {
    return !isUndefined(params['zoom']) && !isUndefined(params['lat']) && !isUndefined(params['lng'])
  }

  hasBounds():boolean {
    return !isEqual(this.bounds, [0,0,0,0]);
  }

  setBounds(bounds:[number,number, number, number]):void {
    this.bounds = bounds;
  }

  getBounds():[number,number, number, number] {
    return this.bounds;
  }

  resetBounds():void {
    this.bounds = [0,0,0,0];
  }


  getQuery(queryObj):NavigationExtras {
    queryObj.roll =  queryObj.roll % 360  == 0 ? undefined : queryObj.roll;
    queryObj.heading = queryObj.heading % 360  == 0 ? undefined : queryObj.heading;
    queryObj.pitch = queryObj.pitch == -90 ? undefined : queryObj.pitch;
    return <NavigationExtras> {
      queryParams: queryObj
    };
  }

}
