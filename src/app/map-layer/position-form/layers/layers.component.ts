import {
  Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter,
  style, animate, transition, trigger
} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import * as _ from 'lodash';

@Component({
  animations: [
    trigger(
      'error', [
        transition(':enter', [
          style({opacity: 0}),
          animate('250ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('250ms', style({opacity: 0}))
        ])
      ]
    )
  ],

  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit, OnChanges {

  @ViewChild('layersModal') public layersModal:ModalDirective;
  @ViewChild('addModal') public addModal:ModalDirective;
  @ViewChild('addQueryModal') public addQueryModal:ModalDirective;
  @ViewChild('mapboxModal') public mapboxModal:ModalDirective;
  @ViewChild('tmsModal') public tmsModal:ModalDirective;
  @ViewChild('bingModal') public bingModal:ModalDirective;
  @ViewChild('osmModal') public osmModal:ModalDirective;
  @ViewChild('defaultModal') public defaultModal:ModalDirective;

  @Input('layersString') public layersString:string;
  @Output() submitLayersEmitter = new EventEmitter();

  public layersArray:Array<Object> = [];
  Object:any = Object;

  public examples = [
    {name: 'Urban-Outdoors Wellington NZ V1', layer_obj: {source: 'mapbox', url: 'https://api.mapbox.com/styles/v1/',mapid:'idanbarak/cixg4xdev00ms2qo9e4h5ywsb/tiles/256', access_token: 'pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw'}},
    {name: 'Urban Navigation - Day Use', layer_obj: {source: 'mapbox',url: 'https://api.mapbox.com/styles/v1/', mapid: "idanbarak/ciy1nhhwo00e72sl5a7oc6gm4/tiles/256", access_token:'pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw'}},
    {name: 'Applicative light', layer_obj: {source: 'mapbox',url: 'https://api.mapbox.com/styles/v1/', mapid: "idanbarak/ciy1n0v3400ef2sqde5a354fo/tiles/256", access_token:'pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw'}},
    {name: 'Applicative Dark', layer_obj: {source: 'mapbox',url: 'https://api.mapbox.com/styles/v1/', mapid: "idanbarak/ciy1n4ktd00cy2sn0qv3f2ogy/tiles/256", access_token:'pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw'}},
    {name: 'Mapbox base', layer_obj: {source: 'mapbox', url: 'https://a.tiles.mapbox.com/v4/',mapid:'mapbox.streets', format: 'png', access_token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA'}},
    {name: 'Openstreetmap base', layer_obj: {source:"openstreetmap",url: 'http://a.tile.openstreetmap.org', format: 'png'}},
    {name: 'Bing labels', layer_obj: {source: 'bing', url: 'https://dev.virtualearth.net', style:'AerialWithLabels', key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq'}}

  ];

// {name: 'wmflabs', layer_obj: {url: 'http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'}},
// {name: 'thunderforest', layer_obj: {url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'}},
// {name: 'OpenCycleMap', layer_obj: {url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'}},

public source_images = {
    mapbox: 'http://2rct3i2488gxf9jvb1lqhek9-wpengine.netdna-ssl.com/wp-content/uploads/2016/06/mapbox-logo-256.png',
    bing: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bing_logo_(2013).svg/2000px-Bing_logo_(2013).svg.png',
    tms: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/GDALLogoColor.svg/150px-GDALLogoColor.svg.png',
    openstreetmap:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png'
  };



  public addObject = {
    mapbox: {
      obj: {
          source:'mapbox',
          format: '',
          mapid: '',
          url:'https://api.mapbox.com/v4/'
      },
      required: {
        format: false,
        mapid: false,
        access_token: false
      },
      edit_index: -1,
      modal: 'mapboxModal',
      init() {
        this.obj = {
          source:'mapbox',
          format: '',
          url: 'https://api.mapbox.com/v4/',
          mapid: ''
        };
        this.required = {
          format: false,
          mapid: false,
          access_token: false
        };
        this.edit_index = -1;
      },
      onEdit():boolean {
        return this.edit_index != -1
      }
    },

    openstreetmap: {
      obj: {
        source:'openstreetmap',
        format: '',
        url:''
      },
      required: {
        format: false,
      },
      edit_index: -1,
      modal: 'osmModal',
      init() {
        this.obj = {
          source:'openstreetmap',
          format: '',
          url: '',
        };
        this.required = {
          format: false,
        };
        this.edit_index = -1;
      },
      onEdit():boolean {
        return this.edit_index != -1
      }
    },


    tms: {
      obj: {
        source:'tms',
        format:'',
        url:''
      },
      required: {
        format: false,
      },
      edit_index: -1,
      modal: 'tmsModal',
      init() {
        this.obj = {
          source:'tms',
          format:'',
          url: ''
        };
        this.required = {
          format: false,
        };
        this.edit_index = -1;
      },
      onEdit():boolean {
        return this.edit_index != -1
      }
    },




    bing: {
      obj: {
        source:'bing',
        url:'',
        key: '',
        style: Cesium.BingMapsStyle.AERIAL
      },
      required: {
      },
      styles: _.map(Cesium.BingMapsStyle, (bing_style) => bing_style),
      edit_index: -1,
      modal: 'bingModal',
      init() {
        this.obj = {
          source:'bing',
          url: '',
          key: '',
          style: Cesium.BingMapsStyle.AERIAL
        };
        this.required = {
        };
        this.edit_index = -1;
      },
      onEdit():boolean {
        return this.edit_index != -1
      }
    },


    default: {
      obj: {
        source:'default',
        url:''
      },
      edit_index: -1,
      modal: 'defaultModal',
      required: {
      },
      init() {
        this.obj = {
          source:'default',
          url: ''
        };
        this.required= {
        },
        this.edit_index = -1;
      },
      onEdit():boolean {
        return this.edit_index != -1
      }
    },

    layer_obj:{
      url: '',
    },
    edit_index: -1,
    on_edit: ():boolean => {
      return !_.isEmpty(this.layersArray[this.addObject.edit_index])
    }
  };

  public add_query = {
    query_obj:{
      key: '',
      val: ''
    },
    on_edit: false,
    error: false
  };

  public add_osm= {
    source:'openstreetmap',
    url:'https://a.tile.openstreetmap.org',
    format: 'png'
  };


  constructor(private queryParamsHelperService:QueryParamsHelperService) {}

  submitLayers(hide:boolean=false) {
    let modal = this.layersModal;

    if(this.canApply()) {
      let parsed_layer:string = this.queryParamsHelperService.queryLayersObjectToString(this.layersArray.map(tmsArrayObj => tmsArrayObj['layer_obj']));
      this.submitLayersEmitter .emit({hide, modal, parsed_layer});
    } else {
      modal.hide();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!_.isNil(changes['tmsString'])) {
      this.initLayersArray();
    }
  }

  editModal(layer_item, index:number) {
    let add_obj = this.addObject[layer_item.layer_obj.source];
    add_obj.obj = _.cloneDeep(layer_item.layer_obj);
    add_obj.edit_index = index;
    _.forEach(add_obj.required, (val, key, obj) => {obj[key] = !_.isEmpty(add_obj.obj[key])})
    this[add_obj.modal].show();
  }

  submitAddLayer(layer_obj){
    let add_obj = this.addObject[layer_obj.source];
    if(layer_obj.source == "default") delete layer_obj.source;

      _.forEach(layer_obj, (val, key, obj) => {
        if (!_.isNil(add_obj.required[key]) && !add_obj.required[key]) {
          delete obj[key]
        }
      }
    );

    if(add_obj.onEdit()) {
      this.layersArray[add_obj.edit_index]['layer_obj'] = layer_obj;
    } else {
      this.layersArray.push({layer_obj})
    }

    this[add_obj.modal].hide();
  }

  expandParams(tms_item) {
    tms_item.expand = !tms_item.expand;
  }

  initLayersArray(){
    this.layersArray = this.queryParamsHelperService.queryLayersStringToObjects({layers:this.layersString});
    this.layersArray = this.layersArray.map( layer_obj => { return {layer_obj:layer_obj} });
  }

  removeTms(index:number) {
    this.layersArray.splice(index, 1);
  }


  canApply():boolean{
    let before_change = this.queryParamsHelperService.queryLayersStringToObjects({layers:this.layersString});
    let after_change = this.layersArray.map(tmsArrayObj => tmsArrayObj['layer_obj']);

    return !_.isEqual(before_change, after_change);
  }

  submitQuery (queryObj) {
    if(this.existingKey(this.addObject.layer_obj, queryObj.key) && !this.add_query.on_edit){
      this.add_query.error = true;
      setTimeout(() => {this.add_query.error = false}, 1000)
      return;
    }
    this.addObject.layer_obj[queryObj.key] = [queryObj.val];
    this.addQueryModal.hide();
  }

  deleteKey(obj:{},key:string){
    delete obj[key];
  }

  existingKey(obj:{}, key:string) {
    return key in obj;
  }

  editQuery(query_obj:{key:string, val:string}) {
    this.add_query.query_obj = query_obj;
    this.add_query.on_edit = true;
    this.addQueryModal.show();
  }

  initAddQuery() {
    this.add_query = {
      query_obj:{
        key: '',
        val: '',
      },
      on_edit: false,
      error: false
    }
  }

  ngOnInit() {
  }
}
