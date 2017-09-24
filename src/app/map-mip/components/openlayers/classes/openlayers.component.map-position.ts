/**
 * Created by Harel on 05/02/2017.
 */
import { Params } from '@angular/router';
import { OpenlayersComponent } from '../openlayers.component';

export class OpenlayersMapPosition {
  public queryParamsSubscriber;

  constructor(private openlayers: OpenlayersComponent) {
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.openlayers.queryParamsHelperService.anySizeChange(this.openlayers.prevParams, this.openlayers.currentParams) || this.openlayers.queryParamsHelperService.anyPositionChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
      let positionArr: [number, number] = this.openlayers.queryParamsHelperService.queryPosition(params);
      let sizeArr: [number, number] = this.openlayers.queryParamsHelperService.querySize(params);

      let pixels_map_width = Math.floor(+(this.openlayers.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
      let pixels_map_height = Math.floor(+(this.openlayers.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));

      let max_width = this.openlayers.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
      let max_height = this.openlayers.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;

      let left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
      let top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));

      this.openlayers.container.nativeElement.style.left = `${left_style}px`;
      this.openlayers.container.nativeElement.style.top = `${top_style}px`;
    }
  }

}

/**
 * Created by yairT on 05/02/2017.
 */
