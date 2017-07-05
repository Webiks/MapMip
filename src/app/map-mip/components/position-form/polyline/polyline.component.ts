import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {ActivatedRoute, Params} from "@angular/router";
import {PositionFormService} from "../position-form.service";
import {ModalDirective} from "ng2-bootstrap";
import * as _ from 'lodash';

@Component({
  selector: 'app-polyline',
  templateUrl: './polyline.component.html',
  styleUrls: ['./polyline.component.scss']
})
export class PolylineComponent  {
  @Input() polyline:string;
  @Input() Active;
  @ViewChild('smModal') public smModal:ModalDirective;
  @Output() submitPolylineEmitter = new EventEmitter();
  @Output("togglePolylinePickedEmitter") togglePolylinePickedEmitter = new EventEmitter();
  public polylineArray=[];
  public polylineColors=['blue','green','yellow','grey','black','purple','orange','red'];
  public selectedColor:string='blue';
  constructor(private queryParamsHelperService:QueryParamsHelperService, public positionFormService:PositionFormService) { }


  ngOnChanges(simpleChange: SimpleChange) {
    if(simpleChange['polyline']) {
      this.cloneEditedPolyline();
    }
  }
  cloneEditedPolyline():void{
    this.polylineArray = this.polylineStrToArray()
  }

  polylineStrToArray(polyline: string=this.polyline){
    return this.queryParamsHelperService.polygonsStrToArray(this.polyline); // it's not mistake that we are calling a polygon fun
  }


  polylineArrayToStr(polylineArray=this.polylineArray) {
    return this.queryParamsHelperService.polygonsArrayToStr(polylineArray);
  }


  removeAllPolylines(){
    this.polylineArray = [];
  }

  submitPolylines(hide:boolean=false){
    !this.canApply() ? this.smModal.hide() : this.submitPolylineEmitter.emit({parsed_polylines: this.polylineArrayToStr(), smModal:this.smModal, hide:hide})
  }
  canApply(){
    return !_.isEqual(this.polylineArray, this.polylineStrToArray());
  }
  rmvPolyline(index:number) {
    this.polylineArray.splice(index, 1);
  }
  changePolylineColor(color){
    this.positionFormService.selectedPolylineColor=color;
    this.positionFormService.polylinePickerEmitter.emit(true)
  }

  togglePolylinePicked(onPolylinePicked:boolean){
    this.positionFormService.onPolylinePicked = onPolylinePicked;
    this.positionFormService.polylinePickerEmitter.emit(this.positionFormService.onPolylinePicked)
  }







}
