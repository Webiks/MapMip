import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import * as _ from 'lodash';
import { AjaxService } from '../../services/ajax.service';

@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.scss']
})
export class GeojsonLayerComponent {
  @ViewChild('geoJsonModal') public geoJsonModal: ModalDirective;
  @ViewChild('defaultModal') public defaultModal: ModalDirective;
  @Output() submitGeoJsonEmitter = new EventEmitter();

  private _geojson: string;
  public examples$ = this.ajaxService.getGeoJsonExam();

  public add_geojson = {
    geojson: '',
    edit_index: -1,
    onEdit(): boolean {
      return this.edit_index !== -1;
    },
    init(): void {
      this.edit_index = -1;
      this.geojson = '';
    }
  };

  public geojson_array = [];

  @Input('geojson')
  set geojson(geojson: string) {
    this._geojson = geojson;
    this.initializeGeojsonArray();
  }

  get geojson(): string {
    return this._geojson;
  }

  constructor(private queryParamsHelperService: QueryParamsHelperService, private ajaxService: AjaxService) {
  }

  initializeGeojsonArray(geojson = this.geojson): void {
    this.geojson_array = this.queryParamsHelperService.queryGeoJson({ geojson });
  }

  submitAddGeojson(input) {
    if (this.add_geojson.onEdit()) {
      this.geojson_array[this.add_geojson.edit_index] = input;
    } else {
      this.geojson_array.push(input);
    }
    if (input !== '') {
      this.add_geojson.init();
      this.defaultModal.hide();
    }
  }

  addGeojsonExample(input) {
    this.geojson_array.push(input);
    this.defaultModal.hide();
  }

  submitGeoJson() {

    let $event: { hide: boolean, modal: ModalDirective, parsed_geojson: string } = {
      hide: true,
      modal: this.geoJsonModal,
      parsed_geojson: this.queryParamsHelperService.geojsonArrayToStr(this.geojson_array)
    };
    this.submitGeoJsonEmitter.emit($event);
  }

  removeAllLayers() {
    this.geojson_array = [];
  }

  removeGeojson(index: number) {
    this.geojson_array.splice(index, 1);
  }

  editModal(index: number): void {
    this.add_geojson.geojson = _.cloneDeep(this.geojson_array[index]);
    this.add_geojson.edit_index = index;
    this.defaultModal.show();
  }

}
