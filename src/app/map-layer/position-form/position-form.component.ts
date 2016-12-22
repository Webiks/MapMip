import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})

export class PositionFormComponent implements OnInit {

  public params: {
    lat:{val?: number, permissions: number[]},
    lng:{val?: number, permissions: number[]},
    zoom:{val?: number, permissions: number[]},
    heading:{val?: number, permissions: number[]},
    pitch:{val?: number, permissions: number[]},
    roll:{val?: number, permissions: number[]},
    height:{val?: number, permissions: number[]},
    dim:{val?: number, permissions: number[]},
  } = {
    lat:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    lng:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    zoom:{permissions: [PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    heading:{permissions: [PERMISSIONS['/cesium']]},
    pitch:{permissions: [PERMISSIONS['/cesium']]},
    roll:{permissions: [PERMISSIONS['/cesium']]},
    height:{permissions: [PERMISSIONS['/cesium']]},
    dim:{permissions: [PERMISSIONS['/cesium']]},
  };

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=> {
      _.forEach(this.params, (obj, key) => {
        obj.val = +params[key] || undefined;
      });
    })
  }

  submitForm() {
    let queryParams:{[key: string]: number;} = {};

    _.forEach(this.params, (obj, key) => {
      queryParams[key] = obj.val;
    });

    this.router.navigate([], {queryParams: queryParams})
  }

  havePermission(obj:{permissions:number[]}):boolean {
    let isActive = false;
    _.forEach(obj.permissions, (num:number) => {
      let url:string  = PERMISSIONS[num];
      if(this.router.isActive(url, false)) isActive = true;
    });
    return isActive;
  }

  keys(obj) {
    return Object.keys(obj);
  }

}

export enum PERMISSIONS {
  "/cesium" = 1,
  "/leaflet" = 2,
  "/openlayers" = 3
}
