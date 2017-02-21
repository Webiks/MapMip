import {
  Component, OnInit, style, animate, transition, trigger, HostBinding, Input,
  OnChanges, SimpleChanges
} from '@angular/core';
import {Router, ActivatedRoute, Params, UrlTree, NavigationExtras} from "@angular/router";
import {ModalDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../query-params-helper.service";
import * as _ from 'lodash';
import {Permissions} from "./permissions.enum";
import {PositionFormService} from "./position-form.service";

const position_form_animations = [trigger('showTools',
  [transition(':enter', [
    style({ maxHeight:'0', opacity: 0}),
    animate('0.5s', style({ maxHeight: '500px', opacity: 1 }))
  ]),
    transition(':leave', [
      style({ maxHeight:'500px', opacity: 1}),
      animate('0.5s', style({ maxHeight:'0', opacity: 0 }))
    ])]
)];

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss'],
  animations: position_form_animations
})

export class PositionFormComponent implements OnInit {

  @HostBinding("style.display") display = "block";
  @HostBinding("style.height") height = "auto";
  @HostBinding("style.max-height") maxHeight = "500px";
  @HostBinding('@showTools') showTools = "true";


  public params: {
    lng:{val?: number, permissions: number[], input_type?:string},
    lat:{val?: number, permissions: number[], input_type?:string},
    zoom:{val?: number, permissions: number[], input_type?:string},
    heading:{val?: number, permissions: number[], input_type?:string},
    pitch:{val?: number, permissions: number[], input_type?:string},
    roll:{val?: number, permissions: number[], input_type?:string},
    height:{val?: number, permissions: number[], input_type?:string},
    mode3d:{val?: boolean, permissions: number[], input_type?:string},
    rotate:{val?: boolean, permissions: number[], input_type?:string},
    markers:{val?: string, permissions: number[], input_type?:string},
    layers: {val?: string, permissions: number[], input_type?:string},
    size: {val?: string, permissions: number[], input_type?:string},
    position: {val?: string, permissions: number[], input_type?:string},
    terrain: {val?: string, permissions: number[], input_type?:string},
    lighting: {val?: string, permissions: number[], input_type?:string}
  } = {
    lng:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']]},
    lat:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']]},
    zoom:{permissions: [Permissions['/leaflet'], Permissions['/openlayers']]},
    heading:{permissions: [Permissions['/cesium'], Permissions['/openlayers']]},
    pitch:{permissions: [Permissions['/cesium']]},
    roll:{permissions: [Permissions['/cesium']]},
    height:{permissions: [Permissions['/cesium']]},
    mode3d:{permissions: [Permissions['/cesium']], input_type: 'Bswitch'},
    rotate:{permissions: [Permissions['/openlayers'], Permissions['/cesium?mode3d=0']], input_type: 'Bswitch'},
    markers:{permissions: [Permissions['/cesium'], Permissions['/leaflet'], Permissions['/openlayers']], input_type: 'app-markers'},
    layers: {permissions: [Permissions['/leaflet'], Permissions['/openlayers'], Permissions['/cesium']], input_type: 'app-layers'},
    size: {permissions: [Permissions['/leaflet'], Permissions['/openlayers'], Permissions['/cesium']], input_type: 'app-map-size' },
    position:{permissions: [Permissions['/leaflet'], Permissions['/openlayers'], Permissions['/cesium']], input_type: 'app-map-position' },
    terrain:{permissions: [Permissions['/cesium']], input_type: 'app-terrain' },
    lighting:{permissions: [Permissions['/cesium']], input_type: 'app-map-lighting' }
  };

  constructor(private router:Router, private route:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService,private positionFormService:PositionFormService) {}


  submitMarkers($event: {hide:boolean, smModal:ModalDirective, parsed_markers:string}) {
    this.params.markers.val = $event.parsed_markers;

    this.submitForm().then(()=>{
      if($event.hide || _.isNil(this.params.markers.val)) $event.smModal.hide();
    });
  }

  submitLayers($event: {hide:boolean, modal:ModalDirective, parsed_layer:string}) {
    this.params.layers.val = $event.parsed_layer;

    this.submitForm().then(()=>{
      if($event.hide || _.isNil(this.params.layers.val)) $event.modal.hide();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=> {
      //params
      _.forEach(this.params, (obj, key, ) => {
        switch (key) {
          case "mode3d":
            obj.val = params['mode3d'] == 0 ? false: true;
            break;
          case "rotate":
            if(this.router.isActive("/openlayers", false)) {
              obj.val = params['rotate'] == 0 ? false : true;
            } else {
              obj.val = params['rotate'] == 1 ? true : false;
            }
            break;
          default:
            obj.val = params[key] || undefined;
        }
      });
    })
  }

  submitForm() {
    let queryParams:{[key: string]: number | string | boolean} = {};

    _.forEach(this.params, (obj, key) => {
      let val = obj.val;
      switch (key) {
        case 'mode3d':
          val = obj.val == false ? 0 : 1;
          break;
        case 'rotate':
          if(this.router.isActive("/openlayers", false)) {
            val = obj.val == false ? 0 : undefined;
          } else {
            val = obj.val == true ? 1 : undefined;
          }
          break;
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



  keys(obj) {
    return Object.keys(obj);
  }

}


