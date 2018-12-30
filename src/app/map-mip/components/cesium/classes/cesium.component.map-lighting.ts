/**
 * Created by Harel on 21/02/2017.
 */
import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';

export class CesiumMapLighting {
  public queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anyLightingChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let state = this.cesium.queryParamsHelperService.queryLighting(params);

      if (state === 1) {
        this.cesium.viewer.scene.globe.enableLighting = true;
      } else {
        this.cesium.viewer.scene.globe.enableLighting = false;
      }

    }
  }

}
