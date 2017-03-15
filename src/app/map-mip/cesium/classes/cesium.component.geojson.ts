/**
 * Created by Harel on 14/03/2017.
 */
import {Params} from "@angular/router";
import {CesiumComponent} from "../cesium.component";

export class CesiumGeoJson{
  public queryParamsSubscriber;

  constructor(private cesium:CesiumComponent){
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params) {
    if(this.cesium.queryParamsHelperService.anyGeoJsonChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let url = this.cesium.queryParamsHelperService.queryGeoJson(params);
      this.cesium.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(url));

    }
  }

}
