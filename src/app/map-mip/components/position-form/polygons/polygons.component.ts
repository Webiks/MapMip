import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {ActivatedRoute, Params} from "@angular/router";
import {PositionFormService} from "../position-form.service";
import {ModalDirective} from "ng2-bootstrap";
import * as _ from 'lodash';

@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.css']
})
export class PolygonsComponent implements OnInit {

  @ViewChild('smModal') public smModal:ModalDirective;
  @Input() polygons:string;
  @Input("Active") Active;
  @Output("togglePickedEmitter") togglePickedEmitter = new EventEmitter();
  @Output() submitPolygonsEmitter = new EventEmitter();

  public polygonsArray=[];
  public edited_polygons_array=[];
  constructor(private queryParamsHelperService:QueryParamsHelperService, private route:ActivatedRoute, public positionFormService:PositionFormService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
  }
  queryParams: (Params) => void = (params:Params):void => {
    this.polygonsArray = this.queryParamsHelperService.queryPolygons(params);

    this.polygonsArray = this.polygonsArray.map(polygon => {
      let position = polygon['coords'].toString();
      return {position}
    });

  }
  cloneEditedPolygons(){
    this.edited_polygons_array = _.cloneDeep(this.polygonsArray);
  }
  removeAllPolygons(){
    this.edited_polygons_array = [];
  }
  submitPolygons(hide:boolean=false){
    !this.canApply() ? this.smModal.hide() : this.submitPolygonsEmitter.emit({parsed_polygons: this.parsePolygons(this.edited_polygons_array), smModal:this.smModal, hide:hide})

  }
  canApply(){
    return !_.isEqual(this.edited_polygons_array, this.polygonsArray);
  }
  togglePolygonPicked(onPolygonPicked:boolean){
    //do toggle to button and start draw mode
    this.positionFormService.onPolygonPicked = onPolygonPicked;
    this.positionFormService.polygonPickerEmitter.emit(this.positionFormService.onPolygonPicked)

  }
  parsePolygons(edited_polygons_array) {
    let polygonArrayToStr = edited_polygons_array.map(polygon => {
      let position = polygon.position.split(",");
      let map_polygon = {position};
      return map_polygon;
    });
    return this.queryParamsHelperService.polygonsArrayToStr(polygonArrayToStr);
  }


  rmvPolygon(index:number) {
    this.edited_polygons_array.splice(index, 1);
  }

}
