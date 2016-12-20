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
    lat:{val?: number, premision: number[]},
    lng:{val?: number, premision: number[]},
    zoom:{val?: number, premision: number[]},
    heading:{val?: number, premision: number[]},
    pitch:{val?: number, premision: number[]},
    roll:{val?: number, premision: number[]},
    height:{val?: number, premision: number[]},
    dim:{val?: number, premision: number[]},
  } = {
    lat:{premision: [PREMISIONS['/cesium'], PREMISIONS['/leaflet'], PREMISIONS['/openlayers']]},
    lng:{premision: [PREMISIONS['/cesium'], PREMISIONS['/leaflet'], PREMISIONS['/openlayers']]},
    zoom:{premision: [PREMISIONS['/leaflet'], PREMISIONS['/openlayers']]},
    heading:{premision: [PREMISIONS['/cesium']]},
    pitch:{premision: [PREMISIONS['/cesium']]},
    roll:{premision: [PREMISIONS['/cesium']]},
    height:{premision: [PREMISIONS['/cesium']]},
    dim:{premision: [PREMISIONS['/cesium']]},
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

  hasPremision(obj:{premision:number[]}):boolean {
    let isActive = false;
    _.forEach(obj.premision, (num:number) => {
      let url:string  = PREMISIONS[num];
      if(this.router.isActive(url, false)) isActive = true;
    });
    return isActive;
  }

  keys(obj) {
    return Object.keys(obj);
  }

}

enum PREMISIONS {
  "/cesium" = 1,
  "/leaflet" = 2,
  "/openlayers" = 3
}
