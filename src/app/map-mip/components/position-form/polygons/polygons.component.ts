import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {ActivatedRoute, Params} from "@angular/router";
import {PositionFormService} from "../position-form.service";

@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.css']
})
export class PolygonsComponent implements OnInit {
  @Input() polygons:string;
  @Input("Active") Active;
  @Output("togglePickedEmitter") togglePickedEmitter = new EventEmitter();


  public polygonToAdd = {
    polygon:{
      positions:[]
    }
  };
  public polygonsArray;
  constructor(private queryParamsHelperService:QueryParamsHelperService, private route:ActivatedRoute, public positionFormService:PositionFormService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
  }
  queryParams: (Params) => void = (params:Params):void => {
    this.polygonsArray = this.queryParamsHelperService.queryPolygons(params);

   /* this.polygonsArray = this.polygonsArray.map(polygon => {
      let position = polygon['position'].toString();
      return {position}
    });*/

  }

  togglePolygonPicked(onPolygonPicked:boolean){
    //do toggle to button and start draw mode
    this.positionFormService.onPolygonPicked = onPolygonPicked;
    this.positionFormService.polygonPickerEmitter.emit(this.positionFormService.onPolygonPicked)

  }






}
