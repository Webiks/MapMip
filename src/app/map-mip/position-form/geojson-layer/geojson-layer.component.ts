import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild} from '@angular/core';
import { ModalDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {ActivatedRoute, Params} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.scss']
})
export class GeojsonLayerComponent implements OnInit {
  @ViewChild('geoJsonModal') public geoJsonModal:ModalDirective;
  @ViewChild('defaultModal') public defaultModal:ModalDirective;
  @Input("geojson") private _geojson:string;
  @Output() geojsonChange = new EventEmitter();
  @Output() submitGeoJsonEmitter = new EventEmitter();

  public geojson_array;

  constructor(private queryParamsHelperService:QueryParamsHelperService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
}
  queryParams: (Params) => void = (params:Params):void => {
    this.geojson_array = this.queryParamsHelperService.queryGeoJson({geojson: params['geojson']});
  };


  submitGeoJson() {
    this.submitGeoJsonEmitter.emit();
    this.setGeoJson()
    this.geoJsonModal.hide();
  }


  canApply():boolean{
    let before_change = this.queryParamsHelperService.queryGeojsonStringToObjects({geojson:this.geojson});
    let after_change = this.geojson_array.map(geojsonItem => geojsonItem['url']);

    return !_.isEqual(before_change, after_change);
  }


  get geojson(): string {
    return this._geojson;
  }

  set geojson(value: string) {
    this.geojsonChange.emit(value)
  }

  setGeoJson(){
    let geojson = this.geojson_array;
    this.geojson_array = this.queryParamsHelperService.queryGeoJson({geojson});
    this.queryParamsHelperService.addGeojson(geojson);
  }

  removeAllLayers(){
    this.geojson_array = [];
  }
  removeGeojson(index:number) {
    this.geojson_array.splice(index, 1);
  }

}
