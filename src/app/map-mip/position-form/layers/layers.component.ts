import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalDirective } from 'ngx-bootstrap';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import * as _ from 'lodash';
import { AjaxService } from '../../services/ajax.service';


@Component({
  animations: [
    trigger(
      'error', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('250ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('250ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],

  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit, OnChanges {
  @ViewChild('layersModal') public layersModal: ModalDirective;
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('addQueryModal') public addQueryModal: ModalDirective;
  @ViewChild('mapboxModal') public mapboxModal: ModalDirective;
  @ViewChild('tmsModal') public tmsModal: ModalDirective;
  @ViewChild('bingModal') public bingModal: ModalDirective;
  @ViewChild('osmModal') public osmModal: ModalDirective;
  @ViewChild('defaultModal') public defaultModal: ModalDirective;

  @Input('layersString') public layersString: string;
  @Output() submitLayersEmitter = new EventEmitter();
  public layersArray: Array<Object> = [];
  Object: any = Object;
  public examples$ = this.ajaxService.getLayerExam();

  public source_images = {
    mapbox: 'http://2rct3i2488gxf9jvb1lqhek9-wpengine.netdna-ssl.com/wp-content/uploads/2016/06/mapbox-logo-256.png',
    bing: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bing_logo_(2013).svg/2000px-Bing_logo_(2013).svg.png',
    tms: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/GDALLogoColor.svg/150px-GDALLogoColor.svg.png',
    openstreetmap: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png'
  };

  public addObject = {
    mapbox: {
      obj: {
        source: 'mapbox',
        format: '',
        access_token: '',
        mapid: '',
        url: 'https://api.mapbox.com/v4/'
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
          source: 'mapbox',
          format: '',
          url: 'https://api.mapbox.com/v4/',
          access_token: '',
          mapid: ''
        };
        this.required = {
          format: false,
          mapid: false,
          access_token: false
        };
        this.edit_index = -1;
      },
      onEdit(): boolean {
        return this.edit_index !== -1;
      }
    },
    openstreetmap: {
      obj: {
        source: 'openstreetmap',
        format: '',
        url: ''
      },
      required: {
        format: false
      },
      edit_index: -1,
      modal: 'osmModal',
      init() {
        this.obj = {
          source: 'openstreetmap',
          format: '',
          url: ''
        };
        this.required = {
          format: false
        };
        this.edit_index = -1;
      },
      onEdit(): boolean {
        return this.edit_index !== -1;
      }
    },
    tms: {
      obj: {
        source: 'tms',
        format: '',
        url: ''
      },
      required: {
        format: false
      },
      edit_index: -1,
      modal: 'tmsModal',
      init() {
        this.obj = {
          source: 'tms',
          format: '',
          url: ''
        };
        this.required = {
          format: false
        };
        this.edit_index = -1;
      },
      onEdit(): boolean {
        return this.edit_index !== -1;
      }
    },
    bing: {
      obj: {
        source: 'bing',
        url: '',
        key: '',
        style: Cesium.BingMapsStyle.AERIAL
      },
      required: {},
      styles: _.map(Cesium.BingMapsStyle, (bing_style) => bing_style),
      edit_index: -1,
      modal: 'bingModal',
      init() {
        this.obj = {
          source: 'bing',
          url: '',
          key: '',
          style: Cesium.BingMapsStyle.AERIAL
        };
        this.required = {};
        this.edit_index = -1;
      },
      onEdit(): boolean {
        return this.edit_index !== -1;
      }
    },

    default: {
      obj: {
        url: ''
      },
      edit_index: -1,
      modal: 'defaultModal',
      required: {},
      init() {
        this.obj = {
          url: ''
        };
        this.required = {};
        this.edit_index = -1;
      },
      onEdit(): boolean {
        return this.edit_index !== -1;
      }
    }
  };


  constructor(public queryParamsHelperService: QueryParamsHelperService, private ajaxService: AjaxService) {
  }

  submitLayers(hide = false) {
    let modal = this.layersModal;

    if (this.canApply()) {
      let parsed_layer: string = this.queryParamsHelperService.queryLayersObjectToString(this.layersArray.map(tmsArrayObj => tmsArrayObj['layer_obj']));
      this.submitLayersEmitter.emit({ hide, modal, parsed_layer });
    } else {
      if (hide) {
        modal.hide();
      }
    }
  }

  onKeyPress($event) {
    if ($event.which === 13) {
      this.submitLayers();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!_.isNil(changes['layersString'])) {
      this.initLayersArray();
    }
  }

  editModal(layer_item, index: number) {
    let source = layer_item.layer_obj.source ? layer_item.layer_obj.source : 'default';
    let add_obj = this.addObject[source];
    add_obj.obj = _.cloneDeep(layer_item.layer_obj);
    add_obj.edit_index = index;
    _.forEach(add_obj.required, (val, key: string, obj) => {
      obj[key] = !_.isEmpty(add_obj.obj[key]);
    });
    this[add_obj.modal].show();
  }

  submitAddLayer(layer_obj) {
    let source = layer_obj.source ? layer_obj.source : 'default';
    let add_obj = this.addObject[source];
    if (layer_obj.source === 'default') {
      delete layer_obj.source;
    }

    _.forEach(layer_obj, (val, key: string, obj) => {
        if (!_.isNil(add_obj.required[key]) && !add_obj.required[key]) {
          delete obj[key];
        }
      }
    );

    if (add_obj.onEdit()) {
      this.layersArray[add_obj.edit_index]['layer_obj'] = layer_obj;
    } else {
      this.layersArray.push({ layer_obj });
    }

    this[add_obj.modal].hide();
  }

  expandParams(layer_item) {
    layer_item.expand = !layer_item.expand;
  }

  initLayersArray() {
    let layersArray = this.queryParamsHelperService.queryLayersStringToObjects({ layers: this.layersString });
    layersArray = layersArray.map(layer_obj => new Object({ layer_obj }));
    if (!_.isEqual(this.layersArray, layersArray)) {
      this.layersArray = layersArray;
    }
  }

  removeTms(index: number) {
    this.layersArray.splice(index, 1);
  }


  canApply(): boolean {
    let before_change = this.queryParamsHelperService.queryLayersStringToObjects({ layers: this.layersString });
    let after_change = this.layersArray.map(layerItem => layerItem['layer_obj']);

    return !_.isEqual(before_change, after_change);
  }

  deleteKey(obj: {}, key: string) {
    delete obj[key];
  }

  removeAllLayers() {
    this.layersArray = [];
  }

  ngOnInit() {
  }
}
