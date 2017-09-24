/**
 * Created by Harel on 05/02/2017.
 */
import { Params } from '@angular/router';
import { LeafletComponent } from '../leaflet.component';

export class LeafletMapPosition {
  public queryParamsSubscriber;

  constructor(private leaflet: LeafletComponent) {
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.leaflet.queryParamsHelperService.anySizeChange(this.leaflet.prevParams, this.leaflet.currentParams) || this.leaflet.queryParamsHelperService.anyPositionChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
      let positionArr: [number, number] = this.leaflet.queryParamsHelperService.queryPosition(params);
      let sizeArr: [number, number] = this.leaflet.queryParamsHelperService.querySize(params);

      let pixels_map_width = Math.floor(+(this.leaflet.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
      let pixels_map_height = Math.floor(+(this.leaflet.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));

      let max_width = this.leaflet.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
      let max_height = this.leaflet.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;

      let left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
      let top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));

      this.leaflet.container.nativeElement.style.left = `${left_style}px`;
      this.leaflet.container.nativeElement.style.top = `${top_style}px`;
    }
  }

}

/**
 * Created by yairT on 05/02/2017.
 */
