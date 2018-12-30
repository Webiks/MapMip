/**
 * Created by yairT on 01/02/2017.
 */
import { Params } from '@angular/router';
import { OpenlayersComponent } from '../openlayers.component';

export class OpenLayersMapSize {
  public queryParamsSubscriber;

  constructor(private openlayers: OpenlayersComponent) {
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));

  }

  queryParams(params: Params) {
    let width_or_height_are_nil = this.openlayers.container.nativeElement.style.width === '' || this.openlayers.container.nativeElement.style.height === '';
    if (this.openlayers.queryParamsHelperService.anySizeChange(this.openlayers.prevParams, this.openlayers.currentParams) || width_or_height_are_nil) {
      let sizeArr: [number, number] = this.openlayers.queryParamsHelperService.querySize(params);
      this.openlayers.container.nativeElement.style.width = `${sizeArr[0]}%`;
      this.openlayers.container.nativeElement.style.height = `${sizeArr[1]}%`;
      this.openlayers.map.updateSize();
    }
  }

}
