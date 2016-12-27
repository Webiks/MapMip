import {Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import * as _ from 'lodash';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {Router, Params, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss']
})

export class MarkersComponent implements OnInit{

  @ViewChild('smModal') public smModal:ModalDirective;
  @ViewChild('ul') public ul:ElementRef;

  @Output() submitMarkersEmitter = new EventEmitter();

  public markers_array;
  public edited_markers_array;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(this.queryParams);
    this.ul.nativeElement.scrollTop = 500;
  }

  queryParams: (Params) => void = (params:Params):void => {
    let arr = this.queryParamsHelperService.queryMarkers({markers: params['markers']});
    this.markers_array = arr.map((arr_pos) => {return {str: arr_pos.toString()} });
  };

  cloneEditedMarkers() {
    this.edited_markers_array = _.cloneDeep(this.markers_array);
    this.edited_markers_array.forEach( (val) => {val.disabled = true})
  }

  rmvMarker(index:number) {
    this.edited_markers_array.splice(index, 1);
    this.submitMarkers()
  }

  parseMarkers(edited_markers_array) {
    let markersArrayToStr = edited_markers_array.map((obj) => obj.str);
    return this.queryParamsHelperService.markersArrayToStr(markersArrayToStr);
  }

  submitMarkers(hide:boolean=false) {
    this.submitMarkersEmitter.emit({parsed_markers: this.parseMarkers(this.edited_markers_array), smModal:this.smModal, hide:hide})
   }


}
