import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';

export class CesiumMapSize {
  public queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    let width_or_height_are_nil = this.cesium.container.nativeElement.style.width === '' || this.cesium.container.nativeElement.style.height === '';
    if (this.cesium.queryParamsHelperService.anySizeChange(this.cesium.prevParams, this.cesium.currentParams) || width_or_height_are_nil) {
      let sizeArr: [number, number] = this.cesium.queryParamsHelperService.querySize(params);
      this.cesium.container.nativeElement.style.width = `${sizeArr[0]}%`;
      this.cesium.container.nativeElement.style.height = `${sizeArr[1]}%`;
    }
  }

}
