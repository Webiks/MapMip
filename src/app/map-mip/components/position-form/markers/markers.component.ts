import {Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import * as _ from 'lodash';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {Params, ActivatedRoute} from "@angular/router";
import {PositionFormService} from "../position-form.service";

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
  inputs:["lng", "lat"]
})

export class MarkersComponent implements OnInit{

  @ViewChild('smModal') public smModal:ModalDirective;
  @ViewChild('addModal') public addModal:ModalDirective;
  public lng:number;
  public lat:number;
  @Output() submitMarkersEmitter = new EventEmitter();

  public edit_obj = {
    marker:{
      position:'',
      colorIndex: 0
    },
    edit_index: -1,
    onEdit() {
      return this.edit_index != -1
    },
    init(){
      this.marker = {
        position:'',
        colorIndex: 0
      };
      this.edit_index = -1;
    }
  };

  public markers_array;
  public edited_markers_array;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private route:ActivatedRoute, private positionFormService:PositionFormService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
  }

  queryParams: (Params) => void = (params:Params):void => {
    this.markers_array = this.queryParamsHelperService.queryMarkers({markers: params['markers']});

    this.markers_array = this.markers_array.map(marker => {
      let color = marker['color'] ? marker['color'] : "blue";
      let colorIndex  = this.positionFormService.getSelectedColorIndex(color);
      let position = marker['position'].toString()
      return {position, colorIndex}
    });

    this.cloneEditedMarkers();
  };

  cloneEditedMarkers() {
    this.edited_markers_array = _.cloneDeep(this.markers_array);
  }

  rmvMarker(index:number) {
    this.edited_markers_array.splice(index, 1);
  }

  parseMarkers(edited_markers_array) {
    let markersArrayToStr = edited_markers_array.map(marker => {
      let position = marker.position.split(",");
      let color = this.positionFormService.getSelectedColor(marker.colorIndex);
      let map_marker = {position};
      if(color != 'blue') map_marker['color'] = color;
      return map_marker;
    });
    return this.queryParamsHelperService.markersArrayToStr(markersArrayToStr);
  }

  canApply():boolean {
    return !_.isEqual(this.edited_markers_array, this.markers_array);
  }

  submitMarkers(hide:boolean=false) {
    !this.canApply() ? this.smModal.hide() : this.submitMarkersEmitter.emit({parsed_markers: this.parseMarkers(this.edited_markers_array), smModal:this.smModal, hide:hide})
  }

  submitAddMarkers(markerObj) {
    if(this.edit_obj.onEdit()) {
      this.edited_markers_array[this.edit_obj.edit_index] = markerObj
    } else {
      this.edited_markers_array.push(markerObj)
    }
    this.addModal.hide();
  }

  markerStrRegex(position):boolean {
    let a = position.split(",");
    if(a.length != 3 && a.length != 2) return false;
    return !a.some((o) => !o || Number.isNaN(+o))
  }

  markerCenter() {
    let position:[number, number] = [this.lng , this.lat];
    let center_marker = {position};
    if(this.positionFormService.getSelectedColor() != "blue") {
      center_marker['color'] = this.positionFormService.getSelectedColor();
    }
    this.queryParamsHelperService.addMarker(center_marker);
  }

  togglePicked(onPicked:boolean){
    this.positionFormService.onPicked = onPicked;
    this.positionFormService.markerPickerEmitter.emit(this.positionFormService.onPicked);
  }

  removeAllMarkers():void{
    this.edited_markers_array = [];
  }

  editMarker(index:number) {
    this.edit_obj.marker = _.cloneDeep(this.edited_markers_array[index]);
    this.edit_obj.edit_index = index;
    this.addModal.show();
  }

}
