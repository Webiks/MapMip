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

  selector: 'app-tms',
  templateUrl: './tms.component.html',
  styleUrls: ['./tms.component.scss']
})
export class TmsComponent implements OnInit, OnChanges {

  @ViewChild('tmsModal') public tmsModal:ModalDirective;
  @ViewChild('addModal') public addModal:ModalDirective;
  @ViewChild('addQueryModal') public addQueryModal:ModalDirective;
  @Input('tmsString') public tmsString:string;
  @Output() submitTmsEmitter = new EventEmitter();
  public tmsArray:Array<Object> = [];
  Object:any = Object;
  public examples = [
    {name: 'openstreetmap base', tms_obj: {url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}},
    {name: 'mapbox idan', tms_obj: {url: 'https://api.mapbox.com/styles/v1/idanbarak/cixg4xdev00ms2qo9e4h5ywsb/tiles/256/{z}/{x}/{y}', access_token: 'pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw'}},
    {name: 'wmflabs', tms_obj: {url: 'http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'}},
    {name: 'thunderforest', tms_obj: {url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'}},
    {name: 'OpenCycleMap', tms_obj: {url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'}},

  ];

  public addObject = {
    tms_obj:{
      url: '',
    },
    edit_index: -1,
    on_edit: ():boolean => {
      return !_.isEmpty(this.tmsArray[this.addObject.edit_index])
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



  constructor(private queryParamsHelperService:QueryParamsHelperService) {}

  submitTms(hide:boolean=false) {
    let modal = this.tmsModal;

    if(this.canApply()) {
      let parsed_tms:string = this.queryParamsHelperService.queryTmsObjectToString(this.tmsArray.map(tmsArrayObj => tmsArrayObj['tms_obj']));
      this.submitTmsEmitter.emit({hide, modal, parsed_tms});
    } else {
      this.tmsModal.hide();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!_.isNil(changes['tmsString'])) {
      this.initTmsArray();
    }
  }

  editUrl(tms_item, index:number) {
    this.addObject.tms_obj = _.cloneDeep(tms_item.tms_obj);
    this.addObject.edit_index = index;
    this.addModal.show();
  }

  expandParams(tms_item) {
    tms_item.expand = !tms_item.expand;
  }

  initTmsArray(){
    this.tmsArray = this.queryParamsHelperService.queryTmsStringToObjects({tms:this.tmsString});
    this.tmsArray = this.tmsArray.map( tms_obj => { return {tms_obj:tms_obj} });
  }

  removeTms(index:number) {
    this.tmsArray.splice(index, 1);
  }

  submitAddTms(tms_obj){
    if(this.addObject.on_edit()) {
      this.tmsArray[this.addObject.edit_index]['tms_obj'] = tms_obj;
    } else {
      this.tmsArray.push({tms_obj})
    }
    this.addModal.hide();
  }

  canApply():boolean{
    let before_change = this.queryParamsHelperService.queryTmsStringToObjects({tms:this.tmsString});
    let after_change = this.tmsArray.map(tmsArrayObj => tmsArrayObj['tms_obj']);
    return !_.isEqual(before_change, after_change);
  }

  submitQuery (queryObj) {
    if(this.existingKey(this.addObject.tms_obj, queryObj.key) && !this.add_query.on_edit){
      this.add_query.error = true;
      setTimeout(() => {this.add_query.error = false}, 1000)
      return;
    }
    this.addObject.tms_obj[queryObj.key] = [queryObj.val];
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
