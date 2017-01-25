import {Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import * as _ from 'lodash';
import {QueryParamsHelperService} from "../../query-params-helper.service";
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
  @ViewChild('ul') public ul:ElementRef;
  public addInput:string = "";
  public lng:number;
  public lat:number;
  @Output() submitMarkersEmitter = new EventEmitter();

  public markers_array;
  public edited_markers_array;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private route:ActivatedRoute, private positionFormService:PositionFormService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
    this.ul.nativeElement.scrollTop = 500;
  }

  queryParams: (Params) => void = (params:Params):void => {
    let arr = this.queryParamsHelperService.queryMarkers({markers: params['markers']});
    this.markers_array = arr.map((arr_pos) => {return {str: arr_pos.toString()} });
    this.cloneEditedMarkers();
  };

  cloneEditedMarkers() {
    this.edited_markers_array = _.cloneDeep(this.markers_array);
    this.edited_markers_array.forEach( (val) => {val.disabled = true})
  }

  rmvMarker(index:number) {
    this.edited_markers_array.splice(index, 1);
  }

  parseMarkers(edited_markers_array) {
    let markersArrayToStr = edited_markers_array.map((obj) => obj.str);
    return this.queryParamsHelperService.markersArrayToStr(markersArrayToStr);
  }

  canApply():boolean {
    let array2 = this.markers_array;

    let some = (obj, index) => {
      let obj2 = array2[index];
      if(!obj2) return true;
      return obj.str != obj2.str;
    };

    let array1res:boolean = this.edited_markers_array.some(some);
    array2 = this.edited_markers_array;
    let array2res:boolean = this.markers_array.some(some);

    let regex_is_ok = !this.edited_markers_array.some((obj) => !obj || !this.markerStrRegex(obj.str));
    return (array1res || array2res) && regex_is_ok;
  }

  submitMarkers(hide:boolean=false) {
    !this.canApply() ? this.smModal.hide() : this.submitMarkersEmitter.emit({parsed_markers: this.parseMarkers(this.edited_markers_array), smModal:this.smModal, hide:hide})
  }

  submitAddMarkers(markerStr:string) {
    this.addModal.hide();
    this.edited_markers_array.push({str: markerStr, disabled: true})
  }

  markerStrRegex(markerStr:string):boolean {
    let a = markerStr.split(",");
    if(a.length!=3) return false;
    return !a.some((o) => !o || Number.isNaN(+o))
  }

  markerCenter() {
    let center_marker_position:[number, number] = [this.lng , this.lat];
    this.queryParamsHelperService.addMarker(center_marker_position);
  }

  togglePicked(){
    this.positionFormService.onPicked = !this.positionFormService.onPicked;
    this.positionFormService.markerPickerEmitter.emit(this.positionFormService.onPicked);
  }
}
