import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params, UrlTree} from "@angular/router";
import {ModalDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../query-params-helper.service";
import {isUndefined} from "util";
import * as _ from 'lodash';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})

export class PositionFormComponent implements OnInit {

  public params: {
    lat:{val?: number, permissions: number[], input_type?:string},
    lng:{val?: number, permissions: number[], input_type?:string},
    zoom:{val?: number, permissions: number[], input_type?:string},
    heading:{val?: number, permissions: number[], input_type?:string},
    pitch:{val?: number, permissions: number[], input_type?:string},
    roll:{val?: number, permissions: number[], input_type?:string},
    height:{val?: number, permissions: number[], input_type?:string},
    mode3d:{val?: number, permissions: number[], input_type?:string},
    rotate:{val?: number, permissions: number[], input_type?:string},
    markers:{val?: string, permissions: number[], input_type?:string},
  } = {
    lat:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    lng:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    zoom:{permissions: [PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']]},
    heading:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/openlayers']]},
    pitch:{permissions: [PERMISSIONS['/cesium']]},
    roll:{permissions: [PERMISSIONS['/cesium']]},
    height:{permissions: [PERMISSIONS['/cesium']]},
    mode3d:{permissions: [PERMISSIONS['/cesium']], input_type: 'Bswitch'},
    rotate:{permissions: [PERMISSIONS['/cesium?mode3d=0'], PERMISSIONS['/openlayers']], input_type: 'Bswitch'},
    markers:{permissions: [PERMISSIONS['/cesium'], PERMISSIONS['/leaflet'], PERMISSIONS['/openlayers']], input_type: 'button'}
  };

  public bSwitch: {
    rotate: boolean,
    mode3d: boolean
  } = {
    rotate: false,
    mode3d: true
  };

  constructor(private router:Router, private route:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService) {}

  submitMarkers($event: {hide:boolean, smModal:ModalDirective, parsed_markers:string}) {
    this.params.markers.val = $event.parsed_markers;

    this.submitForm().then(()=>{
      if($event.hide || _.isEmpty(this.params.markers.val)) $event.smModal.hide();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=> {
      //params
      _.forEach(this.params, (obj, key) => {
          obj.val = params[key] || undefined;
      });

      //bSwitch
      this.bSwitch.rotate = this.params.rotate.val == 1 ? true : false;
      this.bSwitch.mode3d = this.params.mode3d.val == 0 ? false: true ;
    })
  }

  submitForm() {
    let queryParams:{[key: string]: number | string | boolean} = {};

    _.forEach(this.params, (obj, key) => {
      let val = obj.val;

      if(!isUndefined(this.bSwitch[key])) {
        val = this.bSwitch[key] ? 1 : 0;
      }

      queryParams[key] = val;
    });

    return this.router.navigate([], {queryParams: queryParams})
  }

  havePermission(obj:{permissions:number[]}):boolean {
    let urlTreeCurrent:UrlTree = this.router.parseUrl(this.router.url);
    let havePermission = false;

    _.forEach(obj.permissions, (num:number) => {
      let url:string  = PERMISSIONS[num];
      let urlTreeCheck:UrlTree = this.router.parseUrl(url);
      let path:string = urlTreeCheck.root.children['primary'].segments[0].path;
      if(this.router.isActive(path, false)){
        havePermission = true;
        _.forEach(urlTreeCheck.queryParams, (val, key) => {
          if(urlTreeCheck.queryParams[key] != urlTreeCurrent.queryParams[key]) havePermission = false;
        });
      }
    });
    return havePermission;
  }

  keys(obj) {
    return Object.keys(obj);
  }

}

export enum PERMISSIONS {
  "/cesium" = 1,
  "/leaflet" = 2,
  "/openlayers" = 3,
  "/cesium?mode3d=0" = 4,
}
