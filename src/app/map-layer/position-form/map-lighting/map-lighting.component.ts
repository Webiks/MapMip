import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {Router, UrlTree} from "@angular/router";

@Component({
  selector: 'app-map-lighting',
  templateUrl: './map-lighting.component.html',
  styleUrls: ['./map-lighting.component.scss']
})
export class MapLightingComponent implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['lighting']) {
      let lighting = this.lighting;
      this.lighting_value = this.queryParamsHelperService.queryLighting({lighting})
    }
  }

  @Input() lighting:string;
  public lighting_value:number;

  constructor(private queryParamsHelperService:QueryParamsHelperService, private router:Router) { }

  toggleLight(){
    this.lighting_value = 1 - this.lighting_value;
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams['lighting'] = this.lighting_value.toString();
    if(this.lighting_value != 1) delete urlTree.queryParams['lighting'];
    this.router.navigateByUrl(urlTree.toString());
  }


}
