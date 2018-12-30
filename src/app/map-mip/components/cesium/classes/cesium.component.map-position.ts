import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';

export class CesiumMapPosition {
  public queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anySizeChange(this.cesium.prevParams, this.cesium.currentParams) || this.cesium.queryParamsHelperService.anyPositionChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let positionArr: [number, number] = this.cesium.queryParamsHelperService.queryPosition(params);
      let sizeArr: [number, number] = this.cesium.queryParamsHelperService.querySize(params);

      let pixels_map_width = Math.floor(+(this.cesium.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
      let pixels_map_height = Math.floor(+(this.cesium.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));

      let max_width = this.cesium.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
      let max_height = this.cesium.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;

      let left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
      let top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));

      this.cesium.container.nativeElement.style.left = `${left_style}px`;
      this.cesium.container.nativeElement.style.top = `${top_style}px`;
    }
  }

}

/**
 * Created by yairT on 05/02/2017.
 */
