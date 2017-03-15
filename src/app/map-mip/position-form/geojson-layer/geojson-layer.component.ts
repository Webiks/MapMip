import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {PopoverDirective} from "ng2-bootstrap";
import {QueryParamsHelperService} from "../../query-params-helper.service";

@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.scss']
})
export class GeojsonLayerComponent implements OnChanges, OnInit {
  @Input("geojson") private _geojson:string;
  @Output() geojsonChange = new EventEmitter();
  @Output() submitGeoJsonEmitter = new EventEmitter();

  constructor(private queryParamsHelperService:QueryParamsHelperService) { }

  ngOnInit() {
    this.setGeoJson();
  }

  onShownPopover() {
    let element:HTMLElement = <HTMLElement>document.querySelector("app-geojson-layer input");
    element.focus();
  }
  submitGeoJson(popDirective:PopoverDirective) {
    this.submitGeoJsonEmitter.emit();
    popDirective.hide()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["_geojson"]){
    }
  }

  get geojson(): string {
    return this._geojson;
  }

  set geojson(value: string) {
    this.geojsonChange.emit(value)
  }

  setGeoJson(){
    let geojson = this.geojson;
    this.geojson = this.queryParamsHelperService.queryGeoJson({geojson});
  }
}
