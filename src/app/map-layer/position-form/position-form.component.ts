import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, UrlTree, NavigationExtras} from "@angular/router";
import {ModalDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../query-params-helper.service";
import * as _ from 'lodash';
import {Permissions} from "./permissions.enum";

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
    lat:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']]},
    lng:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']]},
    zoom:{permissions: [Permissions['/leaflet'], Permissions['/openlayers']]},
    heading:{permissions: [Permissions['/cesium'], Permissions['/openlayers']]},
    pitch:{permissions: [Permissions['/cesium']]},
    roll:{permissions: [Permissions['/cesium']]},
    height:{permissions: [Permissions['/cesium']]},
    mode3d:{permissions: [Permissions['/cesium']], input_type: 'Bswitch'},
    rotate:{permissions: [Permissions['/cesium?mode3d=0'], Permissions['/openlayers']], input_type: 'Bswitch'},
    markers:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']], input_type: 'app-markers'}

  };

  public bSwitch: {
    rotate: boolean,
    mode3d: boolean
  } = {
    rotate: false,
    mode3d: true
  };

  constructor(private router:Router, private route:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService) {}

  /**
   * this func create rusi
   * @param $event
   */
  submitMarkers($event: {hide:boolean, smModal:ModalDirective, parsed_markers:string}) {
    this.params.markers.val = $event.parsed_markers;

    this.submitForm().then(()=>{
      if($event.hide || _.isEmpty(this.params.markers.val)) $event.smModal.hide();
    });
  }

  /**
   *
   */
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

      if(!_.isEmpty(this.bSwitch[key])) {
        val = this.bSwitch[key] ? 1 : 0;
      }

      queryParams[key] = val;
    });

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery(queryParams);
    return this.router.navigate([], navigationExtras);
  }

  havePermission(obj:{permissions:number[]}):boolean {
    let urlTreeCurrent:UrlTree = this.router.parseUrl(this.router.url);
    let havePermission = false;

    _.forEach(obj.permissions, (num:number) => {
      let url:string  = Permissions[num];
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


  markerCenter() {
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let markers_array:Array<[number, number]> = this.queryParamsHelperService.markersStrToArray(urlTree.queryParams['markers']);
    let center_marker:[number, number] = [+urlTree.queryParams['lng'] , +urlTree.queryParams['lat']];
    markers_array.push(center_marker);
    urlTree.queryParams['markers'] = this.queryParamsHelperService.markersArrayToStr(markers_array);
    this.router.navigateByUrl(urlTree.toString())
  }

  keys(obj) {
    return Object.keys(obj);
  }

}
