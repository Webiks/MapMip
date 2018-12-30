import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { PositionFormService } from '../position-form.service';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.scss']
})
export class PolygonsComponent implements OnInit, OnChanges {

  @Input() Active;
  @Input() polygons: string;

  @ViewChild('smModal') public smModal: ModalDirective;
  @Output('togglePickedEmitter') togglePickedEmitter = new EventEmitter();
  @Output() submitPolygonsEmitter = new EventEmitter();

  public polygonsArray = [];

  constructor(private queryParamsHelperService: QueryParamsHelperService, public positionFormService: PositionFormService) {
  }

  ngOnInit() {
  }

  ngOnChanges(simpleChange: SimpleChanges): void {
    if (simpleChange['polygons']) {
      this.cloneEditedPolygons();
    }
  }

  cloneEditedPolygons(): void {
    this.polygonsArray = this.polygonsStrToArray();
  }

  polygonsStrToArray(polygons: string = this.polygons) {
    return this.queryParamsHelperService.polygonsStrToArray(this.polygons);
  }

  polygonsArrayToStr(polygonsArray = this.polygonsArray) {
    return this.queryParamsHelperService.polygonsArrayToStr(polygonsArray);
  }

  removeAllPolygons() {
    this.polygonsArray = [];
  }

  submitPolygons(hide = false) {
    !this.canApply() ? this.smModal.hide() : this.submitPolygonsEmitter.emit({
      parsed_polygons: this.polygonsArrayToStr(),
      smModal: this.smModal,
      hide: hide
    });
  }

  canApply() {
    return !_.isEqual(this.polygonsArray, this.polygonsStrToArray());
  }

  togglePolygonPicked(onPolygonPicked: boolean) {
    // do toggle to button and start draw mode
    this.positionFormService.onPolygonPicked = onPolygonPicked;
    this.positionFormService.polygonPickerEmitter.emit(this.positionFormService.onPolygonPicked);
  }

  rmvPolygon(index: number) {
    this.polygonsArray.splice(index, 1);
  }

}
