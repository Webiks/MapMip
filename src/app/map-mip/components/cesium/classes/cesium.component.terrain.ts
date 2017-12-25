import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';

export class CesiumTerrian {
  public queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anyTerrainChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let url = this.cesium.queryParamsHelperService.queryTerrain(params);

      if (url) {
        this.cesium.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({ url });
        this.cesium.viewer.scene.globe.depthTestAgainstTerrain = true;
      } else {
        this.cesium.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        this.cesium.viewer.scene.globe.depthTestAgainstTerrain = false;
      }

    }
  }

}
