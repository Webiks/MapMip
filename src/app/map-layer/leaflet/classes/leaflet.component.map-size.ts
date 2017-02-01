import {LeafletComponent} from "../leaflet.component";
import {Params} from "@angular/router";

export class LeafletMapSize{
  public queryParamsSubscriber;

  constructor(private leaflet:LeafletComponent){
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params) {
    if(this.leaflet.queryParamsHelperService.anySizeChange(this.leaflet.prevParams, this.leaflet.currentParams)){
      let sizeArr:[number, number] = this.leaflet.queryParamsHelperService.querySize(params);
      this.leaflet.container.nativeElement.style.width = `${sizeArr[0]}%`;
      this.leaflet.container.nativeElement.style.height = `${sizeArr[1]}%`;
      let options={options:this.leaflet.map.getZoom}
      this.leaflet.map.invalidateSize(options)
    }
  }

}
